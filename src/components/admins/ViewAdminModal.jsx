import React from 'react';
import {
  Close,
  Person,
  PersonOff,
  Block
} from '@mui/icons-material';

const ViewAdminModal = ({ 
  showModal, 
  onClose, 
  selectedAdmin, 
  loadingAdmin 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Person style={{ color: '#22c55e', fontSize: '18px' }} />;
      case 'inactive':
        return <PersonOff style={{ color: '#f59e0b', fontSize: '18px' }} />;
      case 'suspended':
        return <Block style={{ color: '#ef4444', fontSize: '18px' }} />;
      default:
        return <Person style={{ color: 'var(--text-dark)', fontSize: '18px' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' };
      case 'inactive':
        return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' };
      case 'suspended':
        return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' };
      default:
        return { color: 'var(--text-dark)', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid var(--text-dark)' };
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return { color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6' };
      case 'admin':
        return { color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4' };
      case 'moderator':
        return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' };
      case 'support':
        return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' };
      default:
        return { color: 'var(--text-dark)', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid var(--text-dark)' };
    }
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-bold"
            style={{ color: 'var(--text-light)' }}
          >
            Admin Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ 
              color: 'var(--text-light)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444'
            }}
          >
            <Close fontSize="small" />
          </button>
        </div>

        {loadingAdmin ? (
          <div className="text-center py-8" style={{ color: 'var(--text-dark)' }}>
            Loading admin details...
          </div>
        ) : selectedAdmin ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Admin ID
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--accent-purple)',
                    fontFamily: 'monospace'
                  }}
                >
                  {selectedAdmin._id}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Username
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {selectedAdmin.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  First Name
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {selectedAdmin.firstName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Last Name
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {selectedAdmin.lastName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Email
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {selectedAdmin.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Role
                </label>
                <div className="p-3">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={getRoleColor(selectedAdmin.role)}
                  >
                    {selectedAdmin.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Status
                </label>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAdmin.status)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(selectedAdmin.status)}
                    >
                      {selectedAdmin.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Last Login
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {selectedAdmin.lastLogin ? new Date(selectedAdmin.lastLogin).toLocaleString() : 'Never'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Created At
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  {new Date(selectedAdmin.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Email Verified
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: selectedAdmin.isEmailVerified ? '#22c55e' : '#ef4444'
                  }}
                >
                  {selectedAdmin.isEmailVerified ? 'Yes' : 'No'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  2FA Enabled
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                    border: '1px solid var(--border-color)',
                    color: selectedAdmin.twoFactorEnabled ? '#22c55e' : '#ef4444'
                  }}
                >
                  {selectedAdmin.twoFactorEnabled ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {selectedAdmin.permissions && selectedAdmin.permissions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                  Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedAdmin.permissions.map((permission, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(106, 13, 173, 0.1)',
                        color: 'var(--accent-purple)',
                        border: '1px solid var(--accent-purple)'
                      }}
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--text-dark)' }}>
            Failed to load admin details
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAdminModal;
