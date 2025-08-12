import React, { useState, useEffect } from 'react';
import { Visibility, Search } from '@mui/icons-material';
import ContentLoader from 'react-content-loader';
import api from '../../api/axios';

export default function WithdrawalsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch withdrawals from API
  const fetchWithdrawals = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get('/admin/transactions/withdrawals', {
        params: {
          page,
          limit: 20,
          search
        }
      });
      
      if (response.success) {
        setWithdrawals(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Search functionality
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchWithdrawals(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return { color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' };
      case 'Pending':
        return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' };
      case 'Processing':
        return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' };
      case 'Failed':
        return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' };
      default:
        return { color: 'var(--text-dark)', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid var(--text-dark)' };
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search style={{ color: 'var(--text-dark)', fontSize: '20px' }} />
          </div>
          <input
            type="text"
            placeholder="Search by Transaction ID..."
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
      </div>

      {/* Withdrawals Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr 
              className="border-b-2" 
              style={{ borderColor: 'var(--accent-purple)' }}
            >
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Transaction ID
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Transaction Hash
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Amount
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Balance After
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Status
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Date
              </th>
              <th className="text-center py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <td colSpan="7" className="py-4 px-4">
                    <ContentLoader 
                      speed={2}
                      width="100%"
                      height={50}
                      backgroundColor="rgba(255, 255, 255, 0.1)"
                      foregroundColor="rgba(255, 255, 255, 0.2)"
                    >
                      <rect x="0" y="10" rx="3" ry="3" width="120" height="12" />
                      <rect x="140" y="10" rx="3" ry="3" width="100" height="12" />
                      <rect x="260" y="10" rx="3" ry="3" width="80" height="12" />
                      <rect x="360" y="10" rx="3" ry="3" width="90" height="12" />
                      <rect x="470" y="10" rx="15" ry="15" width="60" height="12" />
                      <rect x="550" y="10" rx="3" ry="3" width="120" height="12" />
                      <rect x="690" y="10" rx="3" ry="3" width="40" height="12" />
                    </ContentLoader>
                  </td>
                </tr>
              ))
            ) : withdrawals.length > 0 ? (
              withdrawals.map((withdrawal, index) => (
                <tr 
                  key={withdrawal.transactionId} 
                  className="border-b transition-all duration-200 hover:bg-opacity-50"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}
                >
                  <td className="py-4 px-4 text-sm font-mono" style={{ color: 'var(--accent-purple)' }}>
                    {withdrawal.transactionId}
                  </td>
                  <td className="py-4 px-4 text-sm font-mono" style={{ color: 'var(--text-light)' }}>
                    <span title={withdrawal.transactionHash}>
                      {truncateHash(withdrawal.transactionHash)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: '#ff6b6b' }}>
                    -${withdrawal.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-light)' }}>
                    ${withdrawal.balance.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getStatusColor(withdrawal.status)}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                    {formatDate(withdrawal.date)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ 
                        color: 'var(--accent-purple)',
                        background: 'rgba(106, 13, 173, 0.1)',
                        border: '1px solid var(--accent-purple)'
                      }}
                      title="View Full Details"
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
                    <Search style={{ fontSize: '48px', opacity: 0.5 }} />
                    <p className="text-lg">No withdrawals found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && withdrawals.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm" style={{ color: 'var(--text-dark)' }}>
            Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} withdrawals
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchWithdrawals(pagination.currentPage - 1, searchTerm)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: pagination.hasPrev ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid var(--border-color)'
              }}
            >
              Previous
            </button>
            <span className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-light)' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchWithdrawals(pagination.currentPage + 1, searchTerm)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: pagination.hasNext ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid var(--border-color)'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
