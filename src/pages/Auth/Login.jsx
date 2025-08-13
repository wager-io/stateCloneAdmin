import { useState, useEffect } from 'react';
import ForgetPassword from './ForgetPassword'; 
import api from "../../api/axios"
import {toast} from 'sonner'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';

export default function LoginPage() {
  const { setAdminData } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Animated loading dots effect
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
    } else {
      setLoadingDots('');
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async() => {
    if (isLoading) return; 
    
    setIsLoading(true);
    try{
      const response = await api.post("/admin/login", {
        email: formData?.email, password: formData?.password
      })
      if(response?.success){
        toast.success(response?.message)
        setAdminData(response?.data?.admin)
        Cookies.set('token', response?.data?.token);
        navigate("/dashboard")
        return
      }
    }
    catch(err){
      console.log(err)
      if(!err?.success){
        toast.error(err?.message)
        console.log(err)
        return
      }
    }
    finally {
      setIsLoading(false);
    }
  };


  
  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleModalClose = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
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
      `}</style>

      
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--primary-bg)' }}>
        <div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--accent-purple)' }}
        />
        <div 
          className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-5"
          style={{ backgroundColor: 'var(--success-green)' }}
        />
      </div>

      
      <div 
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl border"
        style={{ 
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-light)' }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-dark)' }}>
            Sign in to your account
          </p>
        </div>

       
        <div className="space-y-6">
          
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-light)' }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--primary-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-light)',
                focusRingColor: 'var(--accent-purple)'
              }}
            />
          </div>

         
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-light)' }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--primary-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-light)',
                focusRingColor: 'var(--accent-purple)'
              }}
            />
          </div>

          
          <div className="flex items-center justify-between">
            {/* <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
                className="w-4 h-4 rounded mr-2"
                style={{ accentColor: 'var(--accent-purple)' }}
              />
              <span 
                className="text-sm"
                style={{ color: 'var(--text-dark)' }}
              >
                Remember me
              </span>
            </label> */}
            {/* <button 
              onClick={handleForgotPassword}
              className="text-sm hover:underline"
              style={{ color: 'var(--accent-purple)' }}
            >
              Forgot password?
            </button> */}
          </div>

      
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--accent-purple)',
              focusRingColor: 'var(--accent-purple)'
            }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In{loadingDots}
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

       
        
      
      {showForgotPasswordModal && (
        <ForgetPassword onClose={handleModalClose} />
      )}
    </div>
    </div>
  );
}