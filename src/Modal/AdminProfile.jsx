import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminProfileModal({ isOpen, onClose, adminData }) {
  const [activeTab, setActiveTab] = useState('profile');

  
  const defaultAdminData = {
    id: "admin-98765",
    name: {
      firstName: "Samuel",
      lastName: "Majasan",
    },
    email: "samuelmajasan6@gmail.com",
    status: "active",
    createdAt: new Date("2025-07-30T10:00:00Z"),
    updatedAt: new Date("2025-08-01T09:30:00Z"),
    roles: ["superadmin", "live-support", "Employee-admin"],
    lastLogin: new Date("2025-08-01T09:00:00Z"),
    lastLoginIp: "192.168.1.100",
    isLocked: false,
    profilePictureUrl: "/images.png",
    contact: {
      phoneNumber: "+15551234567",
      country: "United States",
    },
  };

  const admin = adminData || defaultAdminData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success-green)';
      case 'inactive': return 'var(--text-dark)';
      case 'pending': return '#ffa726';
      case 'suspended': return '#f44336';
      default: return 'var(--text-dark)';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy ID');
    }
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
      `}</style>

     
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(26, 26, 46, 0.9)' }}
        onClick={onClose}
      />

      
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border"
        style={{ 
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
       
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center space-x-4">
            <img
              src={admin.profilePictureUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2"
              style={{ borderColor: 'var(--accent-purple)' }}
            />
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                {admin.name.firstName} {admin.name.lastName}
              </h2>
              <div className="flex items-center space-x-3 mt-1">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: getStatusColor(admin.status) + '20',
                    color: getStatusColor(admin.status),
                    border: `1px solid ${getStatusColor(admin.status)}`
                  }}
                >
                  {admin.status.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: 'var(--text-dark)' }}>
                    ID: {admin.id}
                  </span>
                  <button
  onClick={() => copyToClipboard(admin.id)}
  className="p-1 rounded hover:bg-gray-700/20 transition-colors cursor-pointer"
  title="Copy ID"
>
  <svg className="w-4 h-4" style={{ color: 'var(--text-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
</button>

                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-light)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'activity', label: 'Activity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 font-medium transition-all"
              style={{
                color: activeTab === tab.id ? 'var(--accent-purple)' : 'var(--text-dark)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-purple)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

      
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
             
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>Email</label>
                    <p className="mt-1" style={{ color: 'var(--text-light)' }}>{admin.email}</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>Phone</label>
                    <p className="mt-1" style={{ color: 'var(--text-light)' }}>{admin.contact.phoneNumber}</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>Country</label>
                    <p className="mt-1" style={{ color: 'var(--text-light)' }}>{admin.contact.country}</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>Created At</label>
                    <p className="mt-1" style={{ color: 'var(--text-light)' }}>{formatDate(admin.createdAt)}</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>Last Updated</label>
                    <p className="mt-1" style={{ color: 'var(--text-light)' }}>{formatDate(admin.updatedAt)}</p>
                  </div>
                </div>
              </div>

            
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                  Assigned Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {admin.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--accent-purple)',
                        color: 'white'
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                Account Activity
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--text-light)' }}>Last Login</h4>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-dark)' }}>
                        {formatDate(admin.lastLogin)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: 'var(--text-dark)' }}>From IP</p>
                      <p className="font-mono text-sm" style={{ color: 'var(--text-light)' }}>
                        {admin.lastLoginIp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-light)' }}>Account Status</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: admin.isLocked ? '#f44336' : 'var(--success-green)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-dark)' }}>
                        {admin.isLocked ? 'Account Locked' : 'Account Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--primary-bg)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-light)' }}>Security</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-dark)' }}>Two-Factor Authentication</span>
                      <span className="text-sm" style={{ color: 'var(--success-green)' }}>Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-dark)' }}>Password Last Changed</span>
                      <span className="text-sm" style={{ color: 'var(--text-light)' }}>30 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        
        <div className="flex justify-end space-x-3 p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-light)'
            }}
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

