import { useState } from 'react';

export default function ForgetPassword({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.token || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log('Password reset submitted:', formData);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setFormData({
      token: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  // if (!isOpen) return null;

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
      `}</style>

      
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(26, 26, 46, 0.8)' }}
        onClick={handleClose}
      />

      
      <div 
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl border"
        style={{ 
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-dark)' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--text-light)' }}
              >
                Reset Password
              </h2>
              <p style={{ color: 'var(--text-dark)' }}>
                Enter your reset token and new password to update your account.
              </p>
            </div>

            
            <div className="space-y-6">
             
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-light)' }}
                >
                  Reset Token
                </label>
                <input
                  type="text"
                  name="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  placeholder="Enter your reset token"
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
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
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
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--primary-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-light)',
                    focusRingColor: 'var(--accent-purple)'
                  }}
                />
              </div>

              
              {error && (
                <div 
                  className="text-sm p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderColor: '#ff4444',
                    color: '#ff6666'
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            
            <div className="space-y-3 mt-8">
              <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--accent-purple)',
                  focusRingColor: 'var(--accent-purple)'
                }}
              >
                Reset Password
              </button>
              
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-lg font-medium border transition-all hover:opacity-80 focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-light)',
                  backgroundColor: 'transparent',
                  focusRingColor: 'var(--border-color)'
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
           
            <div className="text-center">
              
              <div 
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" 
                style={{ backgroundColor: 'var(--success-green)' }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>

              
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: 'var(--text-light)' }}
              >
                Password Reset Successfully!
              </h3>
              <p 
                className="mb-6"
                style={{ color: 'var(--text-dark)' }}
              >
                Your password has been updated. You can now sign in with your new password.
              </p>

             
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--accent-purple)',
                  focusRingColor: 'var(--accent-purple)'
                }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


