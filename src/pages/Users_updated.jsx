import React, { useState, useEffect } from 'react';
import {
  Search,
  Visibility,
  Add,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage,
  FilterList,
  Person,
  PersonOff,
  Block,
  Verified,
  VerifiedUser,
  Groups,
  TrendingUp,
  AccountBalance,
  VerifiedUserOutlined
} from '@mui/icons-material';
import api from "../api/axios";
import { formatBalance } from '../utils/formatUtils';

export default function Users() {
  const [usersData, setUsersData] = useState({
    users: [],
    pagination: {},
    statistics: {},
    filters: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch users data
  const fetchUsers = async (page = 1, search = '', status = 'all', country = 'all', is_verified = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'all' && { status }),
        ...(country !== 'all' && { country }),
        ...(is_verified !== 'all' && { is_verified }),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await api.get(`/admin/users?${params}`);
      if (response.success) {
        setUsersData(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers(currentPage, searchTerm, statusFilter, countryFilter, verificationFilter);
  }, [currentPage, searchTerm, statusFilter, countryFilter, verificationFilter]);

  // Reset page when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, countryFilter, verificationFilter]);

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

  const truncateUserId = (userId) => {
    return userId.length > 8 ? `${userId.slice(-8).toUpperCase()}` : userId.toUpperCase();
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

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ 
            color: 'var(--text-light)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
          }}
        >
          Users Management
        </h1>
        <p 
          className="text-lg"
          style={{ color: 'var(--text-dark)' }}
        >
          Manage and monitor all registered users
        </p>
      </div>

      {/* Statistics Cards */}
      {usersData.statistics?.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div 
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <Groups style={{ color: 'var(--accent-purple)', fontSize: '24px' }} />
              <div>
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Total Users</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                  {usersData.statistics.overview.totalUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <Person style={{ color: '#22c55e', fontSize: '24px' }} />
              <div>
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Active Users</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                  {usersData.statistics.overview.activeUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <VerifiedUser style={{ color: '#06b6d4', fontSize: '24px' }} />
              <div>
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Verified Users</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                  {usersData.statistics.overview.verifiedUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <PersonOff style={{ color: '#f59e0b', fontSize: '24px' }} />
              <div>
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Unverified</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                  {usersData.statistics.overview.unverifiedUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <AccountBalance style={{ color: '#10b981', fontSize: '24px' }} />
              <div>
                <p style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Total Balance</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                  {formatBalance(usersData.statistics.overview.totalBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div 
        className="rounded-xl p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
          border: '1px solid var(--border-color)',
          boxShadow: `
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 5px 15px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.08)
          `
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search style={{ color: 'var(--text-dark)', fontSize: '20px' }} />
            </div>
            <input
              type="text"
              placeholder="Search by User ID or Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <FilterList style={{ color: 'var(--text-dark)', fontSize: '20px' }} />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '14px'
              }}
            >
              <option value="all" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>All Status</option>
              <option value="active" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Active</option>
              <option value="inactive" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Inactive</option>
              <option value="disabled" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Disabled</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '14px'
              }}
            >
              <option value="all" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>All Verification</option>
              <option value="true" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Verified</option>
              <option value="false" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Unverified</option>
            </select>
          </div>

          {/* Create User Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple), #8b5cf6)',
              color: 'white',
              border: '1px solid var(--accent-purple)',
              boxShadow: '0 4px 15px rgba(106, 13, 173, 0.3)'
            }}
          >
            <Add fontSize="small" />
            Create User
          </button>

          {/* Results Count */}
          <div 
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ 
              color: 'var(--text-light)',
              background: 'rgba(106, 13, 173, 0.1)',
              border: '1px solid var(--accent-purple)'
            }}
          >
            {usersData.pagination?.totalCount || 0} Users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
          border: '1px solid var(--border-color)',
          boxShadow: `
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 5px 15px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.08)
          `
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 
            className="text-xl font-semibold"
            style={{ 
              color: 'var(--text-light)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Users List
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b-2" 
                style={{ borderColor: 'var(--accent-purple)' }}
              >
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  User ID
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Username
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Full Name
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Country
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Balance
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Verification
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Status
                </th>
                <th 
                  className="text-center py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td 
                    colSpan="8" 
                    className="py-12 text-center"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Loading users...
                  </td>
                </tr>
              ) : usersData.users?.length > 0 ? (
                usersData.users.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className="border-b transition-all duration-200 hover:bg-opacity-50"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                    }}
                  >
                    <td 
                      className="py-4 px-6 text-sm font-mono"
                      style={{ color: 'var(--accent-purple)' }}
                      title={user._id}
                    >
                      {truncateUserId(user._id)}
                    </td>
                    <td 
                      className="py-4 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {user.username}
                    </td>
                    <td 
                      className="py-4 px-6 text-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {user.firstName} {user.lastName}
                    </td>
                    <td 
                      className="py-4 px-6 text-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(user.country)}</span>
                        <span>{user.country}</span>
                      </div>
                    </td>
                    <td 
                      className="py-4 px-6 text-sm font-bold"
                      style={{ color: 'var(--success-green)' }}
                    >
                      {formatBalance(user.balance)}
                    </td>
                    <td className="py-4 px-6">
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
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={getStatusColor(user.status)}
                        >
                          {user.status?.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        style={{ 
                          color: 'var(--accent-purple)',
                          background: 'rgba(106, 13, 173, 0.1)',
                          border: '1px solid var(--accent-purple)'
                        }}
                        title="View User Details"
                      >
                        <Visibility fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan="8" 
                    className="py-12 text-center"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search style={{ fontSize: '48px', opacity: 0.5 }} />
                      <p className="text-lg">No users found matching your criteria</p>
                      <p className="text-sm">Try adjusting your search or filter settings</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData.pagination?.totalPages > 1 && (
          <div 
            className="flex items-center justify-between p-6 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div 
              className="text-sm"
              style={{ color: 'var(--text-dark)' }}
            >
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData.pagination?.totalCount || 0)} of {usersData.pagination?.totalCount || 0} users
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === 1 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--border-color)'
                }}
                title="First Page"
              >
                <FirstPage fontSize="small" />
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === 1 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--border-color)'
                }}
                title="Previous Page"
              >
                <NavigateBefore fontSize="small" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, usersData.pagination?.totalPages || 1) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page <= (usersData.pagination?.totalPages || 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                        style={{ 
                          color: page === currentPage ? 'white' : 'var(--text-light)',
                          background: page === currentPage 
                            ? 'var(--accent-purple)' 
                            : 'rgba(106, 13, 173, 0.1)',
                          border: `1px solid ${page === currentPage ? 'var(--accent-purple)' : 'var(--border-color)'}`
                        }}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, usersData.pagination?.totalPages || 1))}
                disabled={currentPage === (usersData.pagination?.totalPages || 1)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === (usersData.pagination?.totalPages || 1) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--border-color)'
                }}
                title="Next Page"
              >
                <NavigateNext fontSize="small" />
              </button>

              <button
                onClick={() => setCurrentPage(usersData.pagination?.totalPages || 1)}
                disabled={currentPage === (usersData.pagination?.totalPages || 1)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === (usersData.pagination?.totalPages || 1) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--border-color)'
                }}
                title="Last Page"
              >
                <LastPage fontSize="small" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
