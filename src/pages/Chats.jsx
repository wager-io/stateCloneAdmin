import React, { useState, useEffect, useRef } from 'react';
import { 
  Chat, 
  Send, 
  Search, 
  AttachFile,
  MoreVert,
  Person,
  AccessTime,
  Circle,
  ArrowBack,
  Delete,
  Close
} from '@mui/icons-material';
import io from 'socket.io-client';
import { backendUrl } from '../api/axios';

export default function Chats() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [socket, setSocket] = useState(null);
  const [chatTickets, setChatTickets] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [showMobileChat, setShowMobileChat] = useState(false); // For mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false); // For dropdown menu
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (activeChatId && chatMessages[activeChatId]) {
      scrollToBottom();
    }
  }, [chatMessages, activeChatId]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(backendUrl(), {
      withCredentials: true
    });
    
    setSocket(newSocket);

    // Listen for chat events
    newSocket.on('support_chats_list', (chats) => {
      setChatTickets(chats);
    });

    newSocket.on('chat_messages', (data) => {
      setChatMessages(prev => ({
        ...prev,
        [data.chatId]: data.messages
      }));
    });

    newSocket.on('new_support_message', (message) => {
      setChatMessages(prev => ({
        ...prev,
        [message.chatId]: [...(prev[message.chatId] || []), message]
      }));
      
      // Update ticket list with new message and increment unread count if not admin
      if (!message.isAdmin) {
        setChatTickets(prev => prev.map(chat => 
          chat.id === message.chatId 
            ? { 
                ...chat, 
                lastMessage: message.content, 
                lastMessageTime: 'just now',
                unreadCount: (chat.unreadCount || 0) + 1
              }
            : chat
        ));
      }
    });

    newSocket.on('chat_status_updated', (data) => {
      setChatTickets(prev => prev.map(chat => 
        chat.id === data.chatId 
          ? { ...chat, status: data.status }
          : chat
      ));
    });

    newSocket.on('messages_marked_read', (data) => {
      if (data.isAdmin) {
        setChatTickets(prev => prev.map(chat => 
          chat.id === data.chatId 
            ? { ...chat, unreadCount: 0 }
            : chat
        ));
      }
    });

    newSocket.on('user_status_updated', (data) => {
      setChatTickets(prev => prev.map(chat => 
        chat.userId === data.userId 
          ? { ...chat, status: data.status }
          : chat
      ));
    });

    newSocket.on('chat_deleted', (data) => {
      setChatTickets(prev => prev.filter(chat => chat.id !== data.chatId));
      setChatMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[data.chatId];
        return newMessages;
      });
    });

    newSocket.on('chat_delete_success', (data) => {
      console.log('Chat deleted successfully:', data.chatId);
    });

    newSocket.on('ticket_end_success', (data) => {
      console.log('Ticket ended successfully:', data.chatId);
    });

    newSocket.on('delete_error', (data) => {
      alert('Error deleting chat: ' + data.error);
    });

    newSocket.on('end_ticket_error', (data) => {
      alert('Error ending ticket: ' + data.error);
    });

    // Fetch initial chats
    newSocket.emit('get_support_chats');

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (socket && activeChatId) {
      socket.emit('get_chat_messages', { chatId: activeChatId });
      socket.emit('join_support_chat', { chatId: activeChatId });
      // Mark messages as read for admin
      socket.emit('mark_messages_read', { chatId: activeChatId, isAdmin: true });
    }
  }, [socket, activeChatId]);

  // Get chat ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat');
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, []);

  // Update URL when chat changes
  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setShowMobileChat(true); // Show chat view on mobile
    const url = new URL(window.location);
    url.searchParams.set('chat', chatId);
    window.history.pushState({}, '', url);
    
    // Reset unread count for this chat
    setChatTickets(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ));
  };

  // Handle back to chat list on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
    setActiveChatId(null);
    const url = new URL(window.location);
    url.searchParams.delete('chat');
    window.history.pushState({}, '', url);
  };

  // Send message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeChatId && socket) {
      socket.emit('send_support_message', {
        chatId: activeChatId,
        senderId: 'admin-001',
        senderName: 'Admin Support',
        content: newMessage,
        isAdmin: true
      });
      setNewMessage('');
      // Auto-scroll after sending
      setTimeout(scrollToBottom, 100);
    }
  };

  // Delete chat function
  const handleDeleteChat = () => {
    if (activeChatId && socket) {
      const confirmDelete = window.confirm('Are you sure you want to delete this chat? This action cannot be undone.');
      if (confirmDelete) {
        socket.emit('delete_chat', { chatId: activeChatId });
        setShowDropdown(false);
        handleBackToList(); // Go back to chat list
      }
    }
  };

  // End ticket function
  const handleEndTicket = () => {
    if (activeChatId && socket) {
      const confirmEnd = window.confirm('Are you sure you want to end this ticket? The customer will no longer be able to send messages.');
      if (confirmEnd) {
        socket.emit('end_ticket', { chatId: activeChatId });
        setShowDropdown(false);
      }
    }
  };

  // Filter chat tickets based on search
  const filteredTickets = chatTickets.filter(ticket =>
    ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const activeChat = chatTickets.find(chat => chat.id === activeChatId);
  const activeMessages = chatMessages[activeChatId] || [];

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--primary-bg)' }}>

      {/* Main Chat Interface */}
      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6">
        <div 
          className="flex rounded-xl overflow-hidden h-full"
          style={{
            background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
            border: '1px solid var(--border-color)',
            boxShadow: `
              0 15px 35px rgba(0, 0, 0, 0.3),
              0 5px 15px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `
          }}>
          {/* Left Sidebar - Chat Tickets */}
          <div 
            className={`w-full md:w-80 md:border-r flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Search Bar */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--text-dark)', fontSize: '18px' }}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Chat Tickets List */}
            <div 
              className="flex-1"
              style={{
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleChatSelect(ticket.id)}
                  className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-opacity-50 ${
                    activeChatId === ticket.id ? 'bg-opacity-20' : ''
                  }`}
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: activeChatId === ticket.id 
                      ? 'rgba(106, 13, 173, 0.1)' 
                      : 'transparent'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{
                          background: 'white',
                          boxShadow: '0 4px 8px rgba(106, 13, 173, 0.3)'
                        }}
                      >
                        {ticket.userAvatar}
                      </div>
                      {/* Status indicator */}
                      <Circle
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          fontSize: '12px',
                          color: getStatusColor(ticket.status)
                        }}
                      />
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 
                          className="font-semibold truncate"
                          style={{ color: 'var(--text-light)' }}
                        >
                          {ticket.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--text-dark)' }}
                          >
                            {ticket.lastMessageTime}
                          </span>
                          {ticket.unreadCount > 0 && (
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{
                                background: 'var(--accent-purple)',
                                color: 'white'
                              }}
                            >
                              {ticket.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <p 
                        className="text-sm truncate"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {ticket.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Active Chat */}
          <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
              <>
                {/* Fixed Chat Header */}
                <div 
                  className="flex-shrink-0 p-4 border-b flex items-center justify-between relative"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    background: 'var(--secondary-bg)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 rounded-lg transition-all duration-200 hover:scale-110 mr-2"
                      style={{ 
                        color: 'var(--text-light)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <ArrowBack fontSize="small" />
                    </button>
                    
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(145deg, var(--accent-purple), #8b3db8)',
                          boxShadow: '0 4px 8px rgba(106, 13, 173, 0.3)'
                        }}
                      >
                        {activeChat.userAvatar}
                      </div>
                      <Circle
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          fontSize: '10px',
                          color: getStatusColor(activeChat.status)
                        }}
                      />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold"
                        style={{ color: 'var(--text-light)' }}
                      >
                        {activeChat.userName}
                      </h3>
                      <p 
                        className="text-sm capitalize"
                        style={{ color: getStatusColor(activeChat.status) }}
                      >
                        {activeChat.status}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ 
                        color: 'var(--text-dark)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </button>
                    
                    {/* Dropdown Content */}
                    {showDropdown && (
                      <div 
                        className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-20"
                        style={{
                          background: 'var(--secondary-bg)',
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <button
                          onClick={handleEndTicket}
                          className="w-full text-left px-4 py-3 hover:bg-opacity-20 transition-all duration-200 flex items-center gap-3 border-b"
                          style={{ 
                            color: 'var(--text-light)',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          <Close fontSize="small" style={{ color: '#f59e0b' }} />
                          End Ticket
                        </button>
                        <button
                          onClick={handleDeleteChat}
                          className="w-full text-left px-4 py-3 hover:bg-opacity-20 transition-all duration-200 flex items-center gap-3"
                          style={{ color: '#ef4444' }}
                        >
                          <Delete fontSize="small" />
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scrollable Messages Area */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 p-2 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    maxHeight: 'calc(100vh - 200px)', // Ensure it fits between header and input
                    minHeight: 0
                  }}
                >
                  <style jsx>{`
                    .messages-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {activeMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Chat 
                          style={{ 
                            fontSize: '48px', 
                            color: 'var(--accent-purple)', 
                            opacity: 0.3,
                            marginBottom: '16px'
                          }} 
                        />
                        <p style={{ color: 'var(--text-dark)' }}>
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    </div>
                  ) : (
                    activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-lg ${
                            message.isAdmin ? 'rounded-br-none' : 'rounded-bl-none'
                          }`}
                          style={{
                            background: message.isAdmin 
                              ? 'linear-gradient(145deg, var(--accent-purple), #8b3db8)'
                              : 'linear-gradient(145deg, #2a2d3e, #1f2133)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className="text-xs font-medium"
                              style={{ color: message.isAdmin ? 'rgba(255, 255, 255, 0.8)' : 'var(--accent-purple)' }}
                            >
                              {message.senderName}
                            </span>
                            <AccessTime 
                              style={{ 
                                fontSize: '12px', 
                                color: message.isAdmin ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-dark)' 
                              }} 
                            />
                            <span 
                              className="text-xs"
                              style={{ color: message.isAdmin ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-dark)' }}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p 
                            className="text-sm"
                            style={{ color: message.isAdmin ? 'white' : 'var(--text-light)' }}
                          >
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Fixed Message Input */}
                <div 
                  className="flex-shrink-0 p-4 border-t"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    background: 'var(--secondary-bg)',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hidden sm:block"
                      style={{ 
                        color: 'var(--text-dark)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <AttachFile fontSize="small" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        style={{
                          background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-light)'
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 sm:p-3 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: newMessage.trim() 
                          ? 'linear-gradient(145deg, var(--accent-purple), #8b3db8)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <Send fontSize="small" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Chat 
                    style={{ 
                      fontSize: '64px', 
                      color: 'var(--accent-purple)', 
                      opacity: 0.5,
                      marginBottom: '16px'
                    }} 
                  />
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'var(--text-light)' }}
                  >
                    Select a conversation
                  </h3>
                  <p style={{ color: 'var(--text-dark)' }} >
                    Choose a chat from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
