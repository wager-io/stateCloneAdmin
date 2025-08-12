import React, { useState, useEffect } from 'react';
import {
  Close,
  Person,
  PersonOff,
  Block,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import api from '../../api/axios';

const AdminProfileModal = ({ 
  showModal, 
  onClose, 
  currentAdmin 
}) => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Fetch full admin details when modal opens
  useEffect(() => {
    if (showModal && currentAdmin?._id) {
      fetchAdminDetails(currentAdmin._id);
    }
  }, [showModal, currentAdmin]);

  const fetchAdminDetails = async (adminId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/get-admin/${adminId}`);
      if (response.success) {
        setAdminDetails(response.data);
        setEditForm({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form when canceling edit
      setEditForm({
        firstName: adminDetails?.firstName || '',
        lastName: adminDetails?.lastName || '',
        email: adminDetails?.email || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Here you would implement the update API call
      // const response = await api.put(`/admin/update-profile`, editForm);
      // if (response.success) {
      //   setAdminDetails(response.data);
      //   setEditMode(false);
      // }
      console.log('Update profile:', editForm);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

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
            My Profile
          </h2>
          <div className="flex items-center gap-2">
            {/* {!editMode ? (
              <button
                onClick={handleEditToggle}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  color: 'var(--text-light)',
                  background: 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--accent-purple)'
                }}
                title="Edit Profile"
              >
                <Edit fontSize="small" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                  style={{ 
                    color: 'white',
                    background: 'rgba(34, 197, 94, 0.8)',
                    border: '1px solid #22c55e'
                  }}
                  title="Save Changes"
                >
                  <Save fontSize="small" />
                </button>
                <button
                  onClick={handleEditToggle}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ 
                    color: 'var(--text-light)',
                    background: 'rgba(148, 163, 184, 0.1)',
                    border: '1px solid var(--border-color)'
                  }}
                  title="Cancel Edit"
                >
                  <Cancel fontSize="small" />
                </button>
              </>
            )} */}
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
        </div>

        {loading ? (
          <div className="text-center py-8" style={{ color: 'var(--text-dark)' }}>
            Loading profile details...
          </div>
        ) : adminDetails ? (
          <div className="space-y-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 p-4 rounded-lg" style={{ background: 'rgba(106, 13, 173, 0.05)' }}>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                style={{
                  background: 'var(--accent-purple)',
                  color: 'var(--text-light)'
                }}
              >
                {adminDetails.firstName?.charAt(0)?.toUpperCase()}{adminDetails.lastName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-light)' }}
                >
                  {adminDetails.firstName} {adminDetails.lastName}
                </h3>
                <p style={{ color: 'var(--text-dark)' }}>@{adminDetails.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={getRoleColor(adminDetails.role)}
                  >
                    {adminDetails.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

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
                  {adminDetails._id}
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
                  {adminDetails.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  First Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--accent-purple)',
                      color: 'var(--text-light)'
                    }}
                  />
                ) : (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)'
                    }}
                  >
                    {adminDetails.firstName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Last Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--accent-purple)',
                      color: 'var(--text-light)'
                    }}
                  />
                ) : (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)'
                    }}
                  >
                    {adminDetails.lastName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--accent-purple)',
                      color: 'var(--text-light)'
                    }}
                  />
                ) : (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)'
                    }}
                  >
                    {adminDetails.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Status
                </label>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(adminDetails.status)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(adminDetails.status)}
                    >
                      {adminDetails.status?.toUpperCase()}
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
                  {adminDetails.lastLogin ? new Date(adminDetails.lastLogin).toLocaleString() : 'Never'}
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
                  {new Date(adminDetails.createdAt).toLocaleString()}
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
                    color: adminDetails.isEmailVerified ? '#22c55e' : '#ef4444'
                  }}
                >
                  {adminDetails.isEmailVerified ? 'Yes' : 'No'}
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
                    color: adminDetails.twoFactorEnabled ? '#22c55e' : '#ef4444'
                  }}
                >
                  {adminDetails.twoFactorEnabled ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {adminDetails.permissions && adminDetails.permissions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                  My Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {adminDetails.permissions.map((permission, index) => (
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
            Failed to load profile details
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfileModal;
