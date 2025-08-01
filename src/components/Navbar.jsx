import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminProfile from '../Modal/AdminProfile';
import AdminChat from '../Modal/AdminChat';
import { 
  Menu as MenuIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const {adminData} = useAuth(); 
  const navigate = useNavigate();
  const [admin, setAdmin] = useState('Super Admin');
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // useEffect(() => {
  //    const token = Cookies.get('token');   
  //   if (!token) {
  //     navigate('/login');
  //   }
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAdminClick = () => {
    if (isMobile) {
      toggleSidebar();
    } else {
      setAdminModalOpen(true);
    }
  };

  const closeAdminModal = () => {
    setAdminModalOpen(false);
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
  };

  const firstLetter = admin.charAt(0).toUpperCase();

  return (
    <>
    {adminData && (
      <>
        <div className={`fixed top-0 left-0 w-full h-[60px] z-50 transition-all duration-300 px-5 ${
          scrolled ? 'shadow-lg' : 'backdrop-blur-sm'
        }`}
          style={{
            background: scrolled ? 'var(--secondary-bg)' : 'var(--secondary-bg)95',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: scrolled 
              ? '0 8px 32px rgba(106, 13, 173, 0.25), 0 4px 16px rgba(106, 13, 173, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
              : '0 4px 20px rgba(106, 13, 173, 0.15), 0 2px 8px rgba(106, 13, 173, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
          }}>
          <div className="h-full">
            <div className="container mx-auto h-full flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <img 
                  src="/assets/logo.png" 
                  alt="WAGER" 
                  className="h-8 w-auto transition-transform duration-200 hover:scale-105"
                />
              </Link>

              <div className="flex-1"></div>

              <div className="flex items-center space-x-4">
                {/* Chat Icon */}
                <button 
                  onClick={() => setChatModalOpen(true)}
                  className="relative p-2 rounded-lg transition-colors cursor-pointer duration-200 hover:bg-gray-700/20"
                  title="Chat"
                >
                  <ChatIcon style={{ color: 'var(--text-light)', fontSize: '20px' }} />
                  <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                </button>

                {/* Notifications */}
                <button 
                  className="relative p-2 rounded-lg transition-colors cursor-pointer duration-200 hover:bg-gray-700/20"
                  title="Notifications"
                >
                  <NotificationsIcon style={{ color: 'var(--text-light)', fontSize: '20px' }} />
                  <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs text-white font-bold">5</span>
                  </span>
                </button>

                {/* Admin Avatar */}
                <div 
                  onClick={handleAdminClick}
                  className="flex items-center space-x-1 pl-3 px-2 cursor-pointer rounded-lg transition-colors duration-200 hover:bg-gray-700/20"
                  title="Admin Profile"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-medium shadow-md transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'var(--accent-purple)',
                      color: 'var(--text-light)'
                    }}
                  >
                    {firstLetter}
                  </div>
                  <span 
                    className="text-sm hidden sm:block font-medium"
                    style={{ color: 'var(--text-light)' }}
                  >
                    {admin}
                  </span>
                </div>
              </div>

              {/* Mobile Menu Icon */}
              <button 
                className="md:hidden ml-3 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700/20"
                onClick={toggleSidebar}
                title="Menu"
              >
                <MenuIcon style={{ color: 'var(--text-light)', fontSize: '24px' }} />
              </button>
            </div>
          </div>
        </div>

        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
        {adminModalOpen && <AdminProfile isOpen={adminModalOpen} onClose={closeAdminModal} />}
        {chatModalOpen && <AdminChat isOpen={chatModalOpen} onClose={closeChatModal} />}
      </>
      )}
    </>

  );
}
