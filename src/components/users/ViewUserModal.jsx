import React, { useState, useEffect } from 'react';
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
  Group,
  Edit,
  Save,
  Cancel,
  Lock,
  LockOpen,
  MoneyOff,
  AttachMoney
} from '@mui/icons-material';
import { TextField, Button, Switch, FormControlLabel, Tooltip, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import api from '../../api/axios';

const ViewUserModal = ({ 
  showModal, 
  onClose, 
  initialUser, 
  loadingUser,
  onUserUpdate
}) => {
  const [user, setUser] = useState(initialUser);
  const [editingSection, setEditingSection] = useState({
    basic: false,
    location: false,
    referral: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleSaveBalance = async () => {
    try {
      setIsSaving(true);
      const response = await api.patch(`/admin/users/balance/${user._id}`, {
        balance: parseFloat(newBalance)
      });
      if (response.success) {
        setUser(prev => ({ ...prev, balance: parseFloat(newBalance) }));
        onUserUpdate({ ...user, balance: parseFloat(newBalance) });
        setIsEditingBalance(false);
        showMessage('Balance updated successfully');
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      showMessage(error.response?.data?.message || 'Failed to update balance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveBasic = async () => {
    try {
      setIsSaving(true);
      const basicData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        language: user.language
      };
      const response = await api.patch(`/admin/users/basic/${user._id}`, basicData);
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data }));
        onUserUpdate({ ...user, ...response.data });
        setEditingSection(prev => ({ ...prev, basic: false }));
        showMessage('Basic information updated successfully');
      }
    } catch (error) {
      console.error('Error updating basic info:', error);
      showMessage(error.response?.data?.message || 'Failed to update basic information', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    try {
      setIsSaving(true);
      const locationData = {
        country: user.country,
        state: user.state,
        city: user.city,
        postalCode: user.postalCode,
        residentAddress: user.residentAddress
      };
      const response = await api.patch(`/admin/users/location/${user._id}`, locationData);
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data }));
        onUserUpdate({ ...user, ...response.data });
        setEditingSection(prev => ({ ...prev, location: false }));
        showMessage('Location information updated successfully');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      showMessage(error.response?.data?.message || 'Failed to update location information', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveReferral = async () => {
    try {
      setIsSaving(true);
      const referralData = {
        commissionRate: user.commissionRate,
        currentLevel: user.currentLevel,
        referralCampaign: user.referralCampaign
      };
      const response = await api.patch(`/admin/users/referral/${user._id}`, referralData);
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data }));
        onUserUpdate({ ...user, ...response.data });
        setEditingSection(prev => ({ ...prev, referral: false }));
        showMessage('Referral information updated successfully');
      }
    } catch (error) {
      console.error('Error updating referral info:', error);
      showMessage(error.response?.data?.message || 'Failed to update referral information', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleWithdrawalStatus = async () => {
    try {
      setIsSaving(true);
      const response = await api.patch(`/admin/users/withdrawal-status/${user._id}`, {
        withdrawalDisabled: !user.withdrawalDisabled
      });
      if (response.success) {
        setUser(prev => ({
          ...prev,
          withdrawalDisabled: !prev.withdrawalDisabled
        }));
        onUserUpdate({
          ...user,
          withdrawalDisabled: !user.withdrawalDisabled
        });
        showMessage(
          user.withdrawalDisabled 
            ? 'Withdrawals enabled successfully' 
            : 'Withdrawals disabled successfully'
        );
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      showMessage(error.message || 'Failed to update withdrawal status', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleUserStatus = async () => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    try {
      setIsSaving(true);
      const response = await api.patch(`/admin/users/status/${user._id}`, {
        status: newStatus
      });
      if (response.success) {
        setUser(prev => ({
          ...prev,
          status: newStatus
        }));
        onUserUpdate({
          ...user,
          status: newStatus
        });
        showMessage(
          newStatus === 'active' 
            ? 'User account enabled successfully' 
            : 'User account disabled successfully'
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      showMessage(error.message || 'Failed to update user status', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUser(initialUser);
    setIsEditing(false);
  };

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

  if (!showModal || !user) return null;

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
        ) : (
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
                {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  {editingSection.basic ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <TextField
                          name="firstName"
                          value={user.firstName || ''}
                          onChange={handleInputChange}
                          size="small"
                          variant="outlined"
                          className="bg-white rounded"
                        />
                        <TextField
                          name="lastName"
                          value={user.lastName || ''}
                          onChange={handleInputChange}
                          size="small"
                          variant="outlined"
                          className="bg-white rounded"
                        />
                      </div>
                      <TextField
                        name="username"
                        value={user.username || ''}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        className="bg-white rounded w-full"
                        label="Username"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 
                        className="text-2xl font-bold mb-1"
                        style={{ color: 'var(--text-light)' }}
                      >
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-lg mb-2" style={{ color: 'var(--text-dark)' }}>
                        @{user.username}
                      </p>
                    </div>
                  )}
                  {!editingSection.basic && (
                    <Tooltip title="Edit user">
                      <IconButton 
                        onClick={() => setEditingSection({...editingSection, basic: true})}
                        style={{ color: 'var(--accent-purple)' }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(user.status)}
                    >
                      {user.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(user.is_verified)}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        color: user.is_verified ? '#22c55e' : '#f59e0b',
                        background: user.is_verified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${user.is_verified ? '#22c55e' : '#f59e0b'}`
                      }}
                    >
                      {user.is_verified ? 'Email Verified' : 'Email Unverified'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex justify-between items-center mb-1">
                  <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Account Balance</p>
                  {!isEditingBalance ? (
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setNewBalance(user.balance?.toString() || '0');
                        setIsEditingBalance(true);
                      }}
                      style={{ color: '#3b82f6' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  ) : null}
                </div>
                {isEditingBalance ? (
                  <div className="flex items-center gap-2">
                    <TextField
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded w-40"
                      inputProps={{
                        style: { 
                          color: '#10b981',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          textAlign: 'right'
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={handleSaveBalance}
                      disabled={isSaving}
                      style={{ color: '#10b981' }}
                    >
                      <Save fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => setIsEditingBalance(false)}
                      disabled={isSaving}
                      style={{ color: '#ef4444' }}
                    >
                      <Cancel fontSize="small" />
                    </IconButton>
                  </div>
                ) : (
                  <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                    ${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </p>
                )}
                <div className="mt-2 flex flex-col gap-2">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.withdrawalDisabled || false}
                        onChange={toggleWithdrawalStatus}
                        color="error"
                        disabled={isSaving}
                      />
                    }
                    label={
                      <div className="flex items-center gap-1">
                        {user.withdrawalDisabled ? (
                          <>
                            <MoneyOff fontSize="small" style={{ color: 'white' }} />
                            <span style={{ color: 'white' }}>Withdrawals Disabled</span>
                          </>
                        ) : (
                          <>
                            <AttachMoney fontSize="small" style={{ color: 'white' }} />
                            <span style={{ color: 'white' }}>Withdrawals Enabled</span>
                          </>
                        )}
                      </div>
                    }
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.status === 'active'}
                        onChange={toggleUserStatus}
                        color={user.status === 'active' ? 'success' : 'default'}
                        disabled={isSaving}
                      />
                    }
                    label={
                      <div className="flex items-center gap-1">
                        {user.status === 'active' ? (
                          <>
                            <LockOpen fontSize="small" style={{ color: 'white' }} />
                            <span style={{ color: 'white' }}>Account Active</span>
                          </>
                        ) : (
                          <>
                            <Lock fontSize="small" style={{ color: 'white' }} />
                            <span style={{ color: 'white' }}>Account Disabled</span>
                          </>
                        )}
                      </div>
                    }
                    labelPlacement="start"
                  />
                </div>
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
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-light)' }}>
                  Basic Information
                </h4>
                {!editingSection.basic ? (
                  <Tooltip title="Edit Basic Information">
                    <IconButton
                      onClick={() => setEditingSection(prev => ({ ...prev, basic: true }))}
                      size="small"
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSaveBasic}
                      disabled={isSaving}
                      startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {isSaving ? 'Saving...' : 'Save Basic'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        color: '#1e40af',
                        borderColor: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        '&:hover': {
                          backgroundColor: '#dbeafe',
                          borderColor: '#2563eb',
                          color: '#1e40af'
                        },
                        fontWeight: 500,
                        marginLeft: '8px',
                        textTransform: 'none',
                        borderRadius: '4px'
                      }}
                      onClick={() => {
                        setUser(initialUser);
                        setEditingSection(prev => ({ ...prev, basic: false }));
                      }}
                      disabled={isSaving}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    User ID
                  </label>
                  {editingSection.basic ? (
                    <TextField
                      name="_id"
                      value={user._id || ''}
                      disabled
                      size="small"
                      variant="outlined"
                      fullWidth
                      className="bg-gray-100"
                    />
                  ) : (
                    <div className="p-3 rounded-lg"
                      style={{ 
                        background: 'rgba(106, 13, 173, 0.1)',
                        border: '1px solid var(--accent-purple)',
                        color: 'var(--accent-purple)',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}
                    >
                      {user._id}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Email
                  </label>
                  {editingSection.basic ? (
                    <TextField
                      fullWidth
                      name="email"
                      value={user.email || ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid #06b6d4'
                    }}>
                      <Email style={{ color: '#06b6d4', fontSize: '16px' }} />
                      <span style={{ color: '#06b6d4' }}>{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Language
                  </label>
                  {editingSection.basic ? (
                    <TextField
                      fullWidth
                      name="language"
                      value={user.language || 'English'}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                    </TextField>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10b981'
                    }}>
                      <Language style={{ color: '#10b981', fontSize: '16px' }} />
                      <span style={{ color: '#10b981' }}>{user.language || 'English'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Date of Birth
                  </label>
                  {editingSection.basic ? (
                    <TextField
                      fullWidth
                      name="dateOfBirth"
                      type="date"
                      value={user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  ) : user?.dateOfBirth ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid #f59e0b'
                    }}>
                      <CalendarToday style={{ color: '#f59e0b', fontSize: '16px' }} />
                      <span style={{ color: '#f59e0b' }}>
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400">Not set</div>
                  )}
                </div>

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
                      {new Date(user.createdAt).toLocaleDateString()}
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
                    {user.affiliateCode || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div 
              className="rounded-xl p-6 mt-6"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-light)' }}>
                  Location Information
                </h4>
                {!editingSection.location ? (
                  <Tooltip title="Edit Location">
                    <IconButton
                      onClick={() => setEditingSection(prev => ({ ...prev, location: true }))}
                      size="small"
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSaveLocation}
                      disabled={isSaving}
                      startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {isSaving ? 'Saving...' : 'Save Location'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        color: '#1e40af',
                        borderColor: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        '&:hover': {
                          backgroundColor: '#dbeafe',
                          borderColor: '#2563eb',
                          color: '#1e40af'
                        },
                        fontWeight: 500,
                        marginLeft: '8px',
                        textTransform: 'none',
                        borderRadius: '4px'
                      }}
                      onClick={() => {
                        setUser(initialUser);
                        setEditingSection(prev => ({ ...prev, location: false }));
                      }}
                      disabled={isSaving}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Country
                  </label>
                  {editingSection.location ? (
                    <TextField
                      fullWidth
                      name="country"
                      value={user.country || ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value="">Select Country</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="India">India</option>
                      <option value="Brazil">Brazil</option>
                    </TextField>
                  ) : user.country ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid #06b6d4'
                    }}>
                      <span className="text-lg">{getCountryFlag(user.country)}</span>
                      <span style={{ color: '#06b6d4' }}>{user.country}</span>
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400">Not set</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    State/Province
                  </label>
                  {editingSection.location ? (
                    <TextField
                      fullWidth
                      name="state"
                      value={user.state || ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                    />
                  ) : user.state ? (
                    <div className="p-3 rounded-lg" style={{ 
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10b981',
                      color: '#10b981'
                    }}>
                      {user.state}
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400">Not set</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    City
                  </label>
                  {editingSection.location ? (
                    <TextField
                      fullWidth
                      name="city"
                      value={user.city || ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                    />
                  ) : user.city ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid #f59e0b'
                    }}>
                      <LocationOn style={{ color: '#f59e0b', fontSize: '16px' }} />
                      <span style={{ color: '#f59e0b' }}>{user.city}</span>
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400">Not set</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Postal Code
                  </label>
                  {editingSection.location ? (
                    <TextField
                      fullWidth
                      name="postalCode"
                      value={user.postalCode || ''}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                    />
                  ) : user.postalCode ? (
                    <div className="p-3 rounded-lg" style={{ 
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid #8b5cf6',
                      color: '#8b5cf6'
                    }}>
                      {user.postalCode}
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400">Not set</div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Resident Address
                </label>
                {editingSection.location ? (
                  <TextField
                    fullWidth
                    name="residentAddress"
                    value={user.residentAddress || ''}
                    onChange={handleInputChange}
                    size="small"
                    variant="outlined"
                    className="bg-white rounded"
                    multiline
                    rows={2}
                  />
                ) : user.residentAddress ? (
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    color: '#22c55e',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {user.residentAddress}
                  </div>
                ) : (
                  <div className="p-3 text-gray-400">Not set</div>
                )}
              </div>
            </div>

            {/* Referral Information */}
            <div 
              className="rounded-xl p-6 mt-6"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-light)' }}>
                  Referral Information
                </h4>
                {!editingSection.referral ? (
                  <Tooltip title="Edit Referral">
                    <IconButton
                      onClick={() => setEditingSection(prev => ({ ...prev, referral: true }))}
                      size="small"
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSaveReferral}
                      disabled={isSaving}
                      startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {isSaving ? 'Saving...' : 'Save Referral'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        color: '#1e40af',
                        borderColor: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        '&:hover': {
                          backgroundColor: '#dbeafe',
                          borderColor: '#2563eb',
                          color: '#1e40af'
                        },
                        fontWeight: 500,
                        marginLeft: '8px',
                        textTransform: 'none',
                        borderRadius: '4px'
                      }}
                      onClick={() => {
                        setUser(initialUser);
                        setEditingSection(prev => ({ ...prev, referral: false }));
                      }}
                      disabled={isSaving}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
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
                      {user.referralCount || 0} referrals
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Commission Rate
                  </label>
                  {editingSection.referral ? (
                    <div className="flex items-center gap-2">
                      <TextField
                        name="commissionRate"
                        type="number"
                        value={user.commissionRate || 0}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        className="bg-white rounded flex-1"
                        inputProps={{
                          min: 0,
                          max: 100,
                          step: 0.1
                        }}
                      />
                      <span>%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ 
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid #22c55e'
                    }}>
                      <AccountBalance style={{ color: '#22c55e', fontSize: '16px' }} />
                      <span style={{ color: '#22c55e' }}>
                        {user.commissionRate || 0}%
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Current Level
                  </label>
                  {editingSection.referral ? (
                    <TextField
                      fullWidth
                      name="current_level"
                      type="number"
                      value={user.current_level || 0}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                      className="bg-white rounded"
                      inputProps={{
                        min: 0,
                        step: 1
                      }}
                    />
                  ) : (
                    <div className="p-3 rounded-lg" style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid #f59e0b',
                      color: '#f59e0b'
                    }}>
                      Level {user.current_level || 0}
                    </div>
                  )}
                </div>
              </div>

              {user.referredBy && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referred By
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid #06b6d4',
                    color: '#06b6d4'
                  }}>
                    {user.referredBy?.username || user.referredBy?.email || 'Unknown User'}
                  </div>
                </div>
              )}

              {editingSection.referral ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referral Campaign
                  </label>
                  <TextField
                    fullWidth
                    name="referralCampaign"
                    value={user.referralCampaign || ''}
                    onChange={handleInputChange}
                    size="small"
                    variant="outlined"
                    className="bg-white rounded"
                    placeholder="Enter referral campaign code"
                  />
                </div>
              ) : user.referralCampaign ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                    Referral Campaign
                  </label>
                  <div className="p-3 rounded-lg" style={{ 
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid #8b5cf6',
                    color: '#8b5cf6'
                  }}>
                    {user.referralCampaign}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Referrals List */}
            {user.referrals && user.referrals.length > 0 && (
              <div 
                className="rounded-xl p-6"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                  Referred Users ({user.referrals.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {user.referrals.map((referral, index) => (
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
        )}
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewUserModal;
