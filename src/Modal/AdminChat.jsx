import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';

// DMSection Component
const DMSection = ({ contact, onBack, messageHistory, setMessageHistory }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  
  const messages = messageHistory[contact?.id] || [];
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && contact?.id) {
      const newMessage = {
        id: Date.now(), 
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
        status: 'sent'
      };
      
      // Update message history for this specific contact
      setMessageHistory(prev => ({
        ...prev,
        [contact.id]: [...(prev[contact.id] || []), newMessage]
      }));
      
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-[#1a1a2e] h-[90vh] flex flex-col text-[#e0e0e0]">
     
      <div className="bg-[#21213e] px-5 py-4 border-b border-[#3a3a5a] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-transparent border-none text-[#e0e0e0] cursor-pointer text-lg p-1 hover:bg-[#3a3a5a] rounded"
          >
            ←
          </button>
          <div className="relative">
            <img
              src={contact?.avatar}
              alt={contact?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {contact?.isOnline && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{ 
                  backgroundColor: '#00e676',
                  borderColor: '#21213e'
                }}
              />
            )}
          </div>
          <div>
            <div className="font-medium text-base">
              {contact?.name || 'Unknown User'}
            </div>
            <div className="text-xs text-[#a0a0a0]">
              {contact?.isOnline ? 'online' : 'last seen today at 10:35 AM'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 custom-scrollbar"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpolygon fill-rule='evenodd' points='20 20 40 0 40 40 0 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] px-3 py-2 rounded-[18px] relative break-words ${
              msg.sender === 'me' 
                ? 'bg-[#6a0dad] text-[#e0e0e0]' 
                : 'bg-[#21213e] text-[#e0e0e0]'
            }`}>
              <div className="mb-1">{msg.text}</div>
              <div className={`text-[11px] text-right flex items-center justify-end gap-1 ${
                msg.sender === 'me' ? 'text-white/70' : 'text-[#a0a0a0]'
              }`}>
                {msg.timestamp}
                {msg.sender === 'me' && (
                  <span className="text-xs">
                    {msg.status === 'sent' && '✓'}
                    {msg.status === 'delivered' && '✓✓'}
                    {msg.status === 'read' && <span className="text-[#00e676]">✓✓</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#21213e] px-5 py-3 border-t border-[#3a3a5a] flex items-end gap-3 flex-shrink-0">
        <Smile 
          size={24} 
          className="cursor-pointer text-[#a0a0a0] mb-2 hover:text-[#6a0dad] transition-colors" 
        />
        <Paperclip 
          size={24} 
          className="cursor-pointer text-[#a0a0a0] mb-2 hover:text-[#6a0dad] transition-colors" 
        />
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-[#1a1a2e] border border-[#3a3a5a] rounded-[20px] px-4 py-2 text-[#e0e0e0] text-sm resize-none min-h-[20px] max-h-[100px] w-full font-inherit focus:outline-none focus:border-[#6a0dad] transition-colors"
            rows={1}
          />
        </div>
        <button
          onClick={sendMessage}
          className={`rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            message.trim() 
              ? 'bg-[#6a0dad] cursor-pointer hover:bg-[#5a0b9a]' 
              : 'bg-[#3a3a5a] cursor-not-allowed'
          }`}
        >
          <Send 
            size={18} 
            className="text-[#e0e0e0] ml-0.5" 
          />
        </button>
      </div>
    </div>
  );
};

// Updated AdminChat Component
export default function AdminChat({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentView, setCurrentView] = useState('contacts');
  const [messageHistory, setMessageHistory] = useState({});

  const chatData = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Hey! How's the project going?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), 
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
       messages:[
    {
      id: 1,
      text: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      sender: 'other',
      status: 'read'
    },
    {
      id: 2,
      text: "I'm doing great, thanks for asking! Just working on some projects.",
      timestamp: "10:32 AM",
      sender: 'me',
      status: 'read',

    },
    {
      id: 3,
      text: "That sounds awesome! What kind of projects?",
      timestamp: "10:33 AM",
      sender: 'other',
      status: 'read'
    },
    {
      id: 4,
      text: "Mostly web development stuff. Building some cool React components.",
      timestamp: "10:35 AM",
      sender: 'me',
      status: 'delivered'
    },
        {
      id: 2,
      text: "I'm doing great, thanks for asking! Just working on some projects.",
      timestamp: "10:32 AM",
      sender: 'me',
      status: 'read',

    },
    {
      id: 3,
      text: "That sounds awesome! What kind of projects?",
      timestamp: "10:33 AM",
      sender: 'other',
      status: 'read'
    },
    {
      id: 4,
      text: "Mostly web development stuff. Building some cool React components.",
      timestamp: "10:35 AM",
      sender: 'me',
      status: 'delivered'
    }
  ]
    },
    {
      id: 2,
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Thanks for the update! I'll review it tomorrow.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), 
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
        messages: []
    },
    {
      id: 3,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Can we schedule a meeting for next week?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      isTyping: false,
        messages: []
    },
    {
      id: 4,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      lastMessage: "The documents have been uploaded to the shared folder.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      isTyping: true,
        messages: []
    },
    {
      id: 5,
      name: "David Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Perfect! See you at the conference.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
        messages: []
    },
    {
      id: 6,
      name: "Lisa Anderson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Could you send me the latest version of the report?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      unreadCount: 3,
      isOnline: true,
      isTyping: false,
        messages: []
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  const filteredChats = chatData.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'unread') return matchesSearch && chat.unreadCount > 0;
    if (selectedFilter === 'online') return matchesSearch && chat.isOnline;
    return matchesSearch;
  });

  const handleChatClick = (chat) => {
    setSelectedContact(chat);
    setCurrentView('dm');
  };

  const handleBackToContacts = () => {
    setCurrentView('contacts');
    setSelectedContact(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        :root {
          --primary-bg: #1a1a2e;
          --secondary-bg: #21213e;
          --accent-purple: #6a0dad;
          --text-light: #e0e0e0;
          --text-dark: #a0a0a0;
          --success-green: #00e676;
          --border-color: #3a3a5a;
          --chart-line: #8884d8;
          --chart-fill: #6a0dad50;
        }
        
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a2e;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a5a;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6a0dad;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3a3a5a #1a1a2e;
        }
      `}</style>

      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(26, 26, 46, 0.9)' }}
        onClick={currentView === 'contacts' ? onClose : undefined}
      />

      <div 
        className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border"
        style={{ 
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        {currentView === 'dm' ? (
          <DMSection 
            contact={selectedContact} 
            onBack={handleBackToContacts}
            messageHistory={messageHistory}
            setMessageHistory={setMessageHistory}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-light)' }}>
                  Messages
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                  {filteredChats.length} conversations
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-light)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>    
            </div>

            {/* Search */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--text-dark)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--primary-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-light)',
                    '--tw-ring-color': 'var(--accent-purple)'
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-1 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'online', label: 'Online' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: selectedFilter === filter.id ? 'var(--accent-purple)' : 'transparent',
                    color: selectedFilter === filter.id ? 'white' : 'var(--text-dark)',
                    border: selectedFilter === filter.id ? 'none' : `1px solid var(--border-color)`
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto max-h-96">
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 mb-4" style={{ color: 'var(--text-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p style={{ color: 'var(--text-dark)' }}>No conversations found</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className="flex items-center p-4 cursor-pointer transition-all hover:bg-opacity-50"
                    style={{ 
                      backgroundColor: 'transparent',
                      '--tw-bg-opacity': '0.5'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="relative mr-3">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.isOnline && (
                        <div 
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                          style={{ 
                            backgroundColor: 'var(--success-green)',
                            borderColor: 'var(--secondary-bg)'
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate" style={{ color: 'var(--text-light)' }}>
                          {chat.name}
                        </h3>
                        <span className="text-xs ml-2" style={{ color: 'var(--text-dark)' }}>
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          {chat.isTyping && (
                            <span className="text-xs mr-1" style={{ color: 'var(--success-green)' }}>
                              typing...
                            </span>
                          )}
                          <p 
                            className="text-sm truncate"
                            style={{ 
                              color: chat.isTyping ? 'var(--success-green)' : 'var(--text-dark)'
                            }}
                          >
                            {chat.isTyping ? 'typing...' : chat.lastMessage}
                          </p>
                        </div>
                        
                        {chat.unreadCount > 0 && (
                          <div 
                            className="min-w-[20px] h-5 px-2 rounded-full flex items-center justify-center ml-2"
                            style={{ backgroundColor: 'var(--accent-purple)' }}
                          >
                            <span className="text-xs text-white font-bold">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}