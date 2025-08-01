import { useState } from 'react';
import ForgetPassword from './ForgetPassword'; 
import {toast} from 'sonner'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Login attempt:', formData);
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
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
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--primary-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-light)',
                focusRingColor: 'var(--accent-purple)'
              }}
            />
          </div>

          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
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
            </label>
            <button 
              onClick={handleForgotPassword}
              className="text-sm hover:underline"
              style={{ color: 'var(--accent-purple)' }}
            >
              Forgot password?
            </button>
          </div>

      
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--accent-purple)',
              focusRingColor: 'var(--accent-purple)'
            }}
          >
            Sign In
          </button>
        </div>

       
        
      
      {showForgotPasswordModal && (
        <ForgetPassword onClose={handleModalClose} />
      )}
    </div>
    </div>
  );
}