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
  AdminPanelSettings
} from '@mui/icons-material';
import api from "../api/axios";
import ViewAdminModal from '../components/admins/ViewAdminModal';
import CreateAdminModal from '../components/admins/CreateAdminModal';

export default function Admins() {
  const [adminsData, setAdminsData] = useState({
    admins: [],
    pagination: {},
    statistics: {},
    filters: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchAdmins = async (page = 1, search = '', status = 'all', role = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'all' && { status }),
        ...(role !== 'all' && { role }),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await api.get(`/admin/get-all-admin?${params}`);
      if (response.success) {
        setAdminsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin by ID
  const fetchAdminById = async (adminId) => {
    try {
      setLoadingAdmin(true);
      const response = await api.get(`/admin/get-admin/${adminId}`);
      if (response.success) {
        setSelectedAdmin(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin:', error);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const response = await api.post('/admin/create', createForm);
      if (response.success) {
        setShowCreateModal(false);
        setCreateForm({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'admin'
        });
        fetchAdmins(currentPage, searchTerm, statusFilter, roleFilter);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle view admin
  const handleViewAdmin = (adminId) => {
    setShowViewModal(true);
    fetchAdminById(adminId);
    
    // Update URL with admin ID
    const url = new URL(window.location);
    url.searchParams.set('adminId', adminId);
    window.history.pushState({}, '', url);
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedAdmin(null);
    
    // Remove admin ID from URL
    const url = new URL(window.location);
    url.searchParams.delete('adminId');
    window.history.pushState({}, '', url);
  };

  // Check URL for admin ID on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminId = urlParams.get('adminId');
    if (adminId) {
      handleViewAdmin(adminId);
    }
  }, []);

  // Fetch admins on component mount and when filters change
  useEffect(() => {
    fetchAdmins(currentPage, searchTerm, statusFilter, roleFilter);
  }, [currentPage, searchTerm, statusFilter, roleFilter]);

  // Reset page when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

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

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--primary-bg)' }}>

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
              placeholder="Search by name, email, or username..."
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
              <option value="suspended" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Suspended</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '14px'
              }}
            >
              <option value="all" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>All Roles</option>
              <option value="super_admin" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Super Admin</option>
              <option value="admin" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Admin</option>
              <option value="moderator" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Moderator</option>
              <option value="support" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Support</option>
            </select>
          </div>

          {/* Create Admin Button */}
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
            Create Admin
          </button>

   
        </div>
      </div>

      {/* Admins Table */}
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
            Admins List
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
                  Admin ID
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
                  Email
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Role
                </th>
                <th 
                  className="text-left py-4 px-6 text-sm font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Last Login
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
                    colSpan="7" 
                    className="py-12 text-center"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Loading admins...
                  </td>
                </tr>
              ) : adminsData.admins?.length > 0 ? (
                adminsData.admins.map((admin, index) => (
                  <tr 
                    key={admin._id} 
                    className="border-b transition-all duration-200 hover:bg-opacity-50"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                    }}
                  >
                    <td 
                      className="py-4 px-6 text-sm font-mono"
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      {admin._id.slice(-8).toUpperCase()}
                    </td>
                    <td 
                      className="py-4 px-6 text-sm font-medium"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {`${admin.firstName} ${admin.lastName}`}
                    </td>
                    <td 
                      className="py-4 px-6 text-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {admin.email}
                    </td>
                    <td className="py-4 px-6">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={getRoleColor(admin.role)}
                      >
                        {admin.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td 
                      className="py-4 px-6 text-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(admin.status)}
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={getStatusColor(admin.status)}
                        >
                          {admin.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleViewAdmin(admin._id)}
                        className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        style={{ 
                          color: 'var(--accent-purple)',
                          background: 'rgba(106, 13, 173, 0.1)',
                          border: '1px solid var(--accent-purple)'
                        }}
                        title="View Admin Details"
                      >
                        <Visibility fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan="7" 
                    className="py-12 text-center"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <AdminPanelSettings style={{ fontSize: '48px', opacity: 0.5 }} />
                      <p className="text-lg">No admins found</p>
                      <p className="text-sm">Try adjusting your search or filter settings</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {adminsData.pagination?.totalPages > 1 && (
          <div 
            className="flex items-center justify-between p-6 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div 
              className="text-sm"
              style={{ color: 'var(--text-dark)' }}
            >
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, adminsData.pagination?.totalCount || 0)} of {adminsData.pagination?.totalCount || 0} admins
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
                {Array.from({ length: Math.min(5, adminsData.pagination?.totalPages || 1) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page <= (adminsData.pagination?.totalPages || 1)) {
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, adminsData.pagination?.totalPages || 1))}
                disabled={currentPage === (adminsData.pagination?.totalPages || 1)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === (adminsData.pagination?.totalPages || 1) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
                  border: '1px solid var(--border-color)'
                }}
                title="Next Page"
              >
                <NavigateNext fontSize="small" />
              </button>

              <button
                onClick={() => setCurrentPage(adminsData.pagination?.totalPages || 1)}
                disabled={currentPage === (adminsData.pagination?.totalPages || 1)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: 'var(--text-light)',
                  background: currentPage === (adminsData.pagination?.totalPages || 1) ? 'rgba(148, 163, 184, 0.1)' : 'rgba(106, 13, 173, 0.1)',
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

      {/* Modals */}
      <ViewAdminModal
        showModal={showViewModal}
        onClose={closeViewModal}
        selectedAdmin={selectedAdmin}
        loadingAdmin={loadingAdmin}
      />

      <CreateAdminModal
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        onSubmit={handleCreateAdmin}
        createLoading={createLoading}
      />
    </div>
  );
}
