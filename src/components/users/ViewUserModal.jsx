import React from 'react';
import {
  Close,
  Person,
  PersonOff,
  Block,
  VerifiedUser,
  Email,
  LocationOn,
  AccountBalance,
  Language,
  CalendarToday,
  Group
} from '@mui/icons-material';

const ViewUserModal = ({ 
  showModal, 
  onClose, 
  selectedUser, 
  loadingUser 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Person style={{ color: '#22c55e', fontSize: '18px' }} />;
      case 'inactive':
        return <PersonOff style={{ color: '#f59e0b', fontSize: '18px' }} />;
      case 'disabled':
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
      case 'disabled':
        return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' };
      default:
        return { color: 'var(--text-dark)', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid var(--text-dark)' };
    }
  };

  const getVerificationIcon = (isVerified) => {
    return isVerified ? 
      <VerifiedUser style={{ color: '#22c55e', fontSize: '18px' }} /> :
      <Person style={{ color: '#f59e0b', fontSize: '18px' }} />;
  };

  const getCountryFlag = (country) => {
    const flags = {
      'Nigeria': '🇳🇬',
      'USA': '🇺🇸',
      'UK': '🇬🇧', 
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Brazil': '🇧🇷',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪'
    };
    return flags[country] || '🌍';
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
        className="max-w-4xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto"
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
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90 "
            style={{ 
              color: 'var(--text-light)',
            }}
          >
            <Close fontSize="small" />
          </button>
        </div>

        {loadingUser ? (
          <div className="text-center py-8" style={{ color: 'var(--text-dark)' }}>
            Loading user details...
          </div>
        ) : selectedUser ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-6 mb-6 p-6 rounded-lg" style={{ background: 'rgba(106, 13, 173, 0.05)' }}>
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                style={{
                  background: 'var(--accent-purple)',
                  color: 'var(--text-light)'
                }}
              >
                {selectedUser.firstName?.charAt(0)?.toUpperCase()}{selectedUser.lastName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 
                  className="text-2xl font-bold mb-1"
                  style={{ color: 'var(--text-light)' }}
                >
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-lg mb-2" style={{ color: 'var(--text-dark)' }}>
                  @{selectedUser.username}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedUser.status)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(selectedUser.status)}
                    >
                      {selectedUser.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(selectedUser.is_verified)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        color: selectedUser.is_verified ? '#22c55e' : '#f59e0b',
                        background: selectedUser.is_verified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${selectedUser.is_verified ? '#22c55e' : '#f59e0b'}`
                      }}
                    >
                      {selectedUser.is_verified ? 'Email Verified' : 'Email Unverified'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Account Balance</p>
                <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                  ${selectedUser.balance?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div 
              className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    User ID
                  </label>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: 'rgba(106, 13, 173, 0.1)',
                      border: '1px solid var(--accent-purple)',
                      color: 'var(--accent-purple)',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  >
                    {selectedUser._id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Email
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid #06b6d4'
                  }}>
                    <Email style={{ color: '#06b6d4', fontSize: '16px' }} />
                    <span style={{ color: '#06b6d4' }}>{selectedUser.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Language
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981'
                  }}>
                    <Language style={{ color: '#10b981', fontSize: '16px' }} />
                    <span style={{ color: '#10b981' }}>{selectedUser.language || 'English'}</span>
                  </div>
                </div>

                {selectedUser.dateOfBirth && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid #f59e0b'
                    }}>
                      <CalendarToday style={{ color: '#f59e0b', fontSize: '16px' }} />
                      <span style={{ color: '#f59e0b' }}>
                        {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Member Since
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid #8b5cf6'
                  }}>
                    <CalendarToday style={{ color: '#8b5cf6', fontSize: '16px' }} />
                    <span style={{ color: '#8b5cf6' }}>
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Affiliate Code
                  </label>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid #22c55e',
                      color: '#22c55e',
                      fontFamily: 'monospace'
                    }}
                  >
                    {selectedUser.affiliateCode || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div 
              className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                Location Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedUser.country && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                      Country
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid #06b6d4'
                    }}>
                      <span className="text-lg">{getCountryFlag(selectedUser.country)}</span>
                      <span style={{ color: '#06b6d4' }}>{selectedUser.country}</span>
                    </div>
                  </div>
                )}

                {selectedUser.state && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                      State
                    </label>
                    <div className="p-3 rounded-lg" style={{ 
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10b981',
                      color: '#10b981'
                    }}>
                      {selectedUser.state}
                    </div>
                  </div>
                )}

                {selectedUser.city && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                      City
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid #f59e0b'
                    }}>
                      <LocationOn style={{ color: '#f59e0b', fontSize: '16px' }} />
                      <span style={{ color: '#f59e0b' }}>{selectedUser.city}</span>
                    </div>
                  </div>
                )}

                {selectedUser.postalCode && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                      Postal Code
                    </label>
                    <div className="p-3 rounded-lg" style={{ 
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid #8b5cf6',
                      color: '#8b5cf6'
                    }}>
                      {selectedUser.postalCode}
                    </div>
                  </div>
                )}
              </div>

              {selectedUser.residentAddress && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Resident Address
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    color: '#22c55e'
                  }}>
                    {selectedUser.residentAddress}
                  </div>
                </div>
              )}
            </div>

            {/* Referral Information */}
            <div 
              className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                Referral Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referral Count
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                    background: 'rgba(106, 13, 173, 0.1)',
                    border: '1px solid var(--accent-purple)'
                  }}>
                    <Group style={{ color: 'var(--accent-purple)', fontSize: '16px' }} />
                    <span style={{ color: 'var(--accent-purple)' }}>
                      {selectedUser.referralCount || 0} referrals
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Commission Rate
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e'
                  }}>
                    <AccountBalance style={{ color: '#22c55e', fontSize: '16px' }} />
                    <span style={{ color: '#22c55e' }}>
                      {selectedUser.commissionRate || 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Current Level
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid #f59e0b',
                    color: '#f59e0b'
                  }}>
                    Level {selectedUser.current_level || 0}
                  </div>
                </div>
              </div>

              {selectedUser.referredBy && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referred By
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid #06b6d4',
                    color: '#06b6d4'
                  }}>
                    {selectedUser.referredBy?.username || selectedUser.referredBy?.email || 'Unknown User'}
                  </div>
                </div>
              )}

              {selectedUser.referralCampaign && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referral Campaign
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid #8b5cf6',
                    color: '#8b5cf6'
                  }}>
                    {selectedUser.referralCampaign}
                  </div>
                </div>
              )}
            </div>

            {/* Referrals List */}
            {selectedUser.referrals && selectedUser.referrals.length > 0 && (
              <div 
                className="rounded-xl p-6"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                  Referred Users ({selectedUser.referrals.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedUser.referrals.map((referral, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg"
                      style={{ 
                        background: 'rgba(106, 13, 173, 0.1)',
                        border: '1px solid var(--accent-purple)'
                      }}
                    >
                      <p style={{ color: 'var(--accent-purple)', fontWeight: 'medium' }}>
                        {referral.username || referral.email || 'Unknown User'}
                      </p>
                      {referral.firstName && referral.lastName && (
                        <p style={{ color: 'var(--text-dark)', fontSize: '12px' }}>
                          {referral.firstName} {referral.lastName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--text-dark)' }}>
            Failed to load user details
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUserModal;
