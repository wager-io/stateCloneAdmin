import React, { useState, useEffect } from 'react';
import { Visibility, Search, ContentCopy, Close } from '@mui/icons-material';
import ContentLoader from 'react-content-loader';
import { toast } from 'sonner';
import api from '../../api/axios';

export default function DepositsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch deposits from API
  const fetchDeposits = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get('/admin/transactions/deposits', {
        params: {
          page,
          limit: 20,
          search
        }
      });
      
      if (response.success) {
        setDeposits(response.data);
        setPagination(response.pagination);
      }
         setLoading(false);
    } catch (error) {
      console.error('Error fetching deposits:', error);
        setLoading(false);
    }
 
  };

  // Initial load
  useEffect(() => {
    fetchDeposits();
  }, []);

  // Search functionality
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchDeposits(1, searchTerm);
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
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return { color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' };
      case 'pending':
      case 'processing':
        return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' };
      case 'failed':
      case 'error':
        return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' };
      default:
        return { color: 'var(--text-dark)', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid var(--text-dark)' };
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setShowModal(false);
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

      {/* Deposits Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr 
              className="border-b-2" 
              style={{ borderColor: 'var(--accent-purple)' }}
            >
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Transaction Hash
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Amount
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Currency
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Balance
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Date
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
                Status
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
            ) : deposits.length > 0 ? (
              deposits.map((deposit, index) => (
                <tr 
                  key={deposit.transactionId} 
                  className="border-b transition-all duration-200 hover:bg-opacity-50"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}
                >
                  {/* Transaction Hash with Copy Button */}
                  <td className="py-4 px-4 text-sm font-mono" style={{ color: 'var(--text-light)' }}>
                    <div className="flex items-center gap-2">
                      <span title={deposit.transactionHash}>
                        {truncateHash(deposit.transactionHash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(deposit.transactionHash)}
                        className="p-1 rounded hover:bg-purple-500/20 transition-colors"
                        title="Copy transaction hash"
                      >
                        <ContentCopy style={{ fontSize: '16px', color: 'var(--accent-purple)' }} />
                      </button>
                    </div>
                  </td>
                  
                  {/* Amount */}
                  <td className="py-4 px-4 text-sm font-bold" style={{ color: 'var(--success-green)' }}>
                    {deposit.metadata?.depositData?.amount || deposit.amount || '0'}
                  </td>
                  
                  {/* Currency */}
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-light)' }}>
                    {deposit.currency}
                  </td>
                  
                  {/* Balance */}
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-light)' }}>
                    {deposit.balance?.toLocaleString()}
                  </td>
                  
                  {/* Date */}
                  <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                    {formatDate(deposit.date)}
                  </td>
                  
                  {/* Status */}
                  <td className="py-4 px-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={getStatusColor(deposit.status)}
                    >
                      {deposit.status}
                    </span>
                  </td>
                  
                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => openModal(deposit)}
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
                    <p className="text-lg">No deposits found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && deposits.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm" style={{ color: 'var(--text-dark)' }}>
            Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} deposits
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchDeposits(pagination.currentPage - 1, searchTerm)}
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
              onClick={() => fetchDeposits(pagination.currentPage + 1, searchTerm)}
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

      {/* Full-Screen Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50">
          <div 
            className="w-full h-full flex flex-col"
            style={{ background: 'var(--primary-bg)' }}
          >
            {/* Modal Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ 
                background: 'var(--secondary-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-light)' }}>
                Transaction Details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  color: 'var(--text-light)',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <Close fontSize="large" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Basic Transaction Info */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Transaction ID
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm" style={{ color: 'var(--accent-purple)' }}>
                          {selectedTransaction.transactionId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.transactionId)}
                          className="p-1 rounded hover:bg-purple-500/20"
                        >
                          <ContentCopy style={{ fontSize: '16px', color: 'var(--accent-purple)' }} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Transaction Hash
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm break-all" style={{ color: 'var(--text-light)' }}>
                          {selectedTransaction.transactionHash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.transactionHash)}
                          className="p-1 rounded hover:bg-purple-500/20 flex-shrink-0"
                        >
                          <ContentCopy style={{ fontSize: '16px', color: 'var(--accent-purple)' }} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Amount
                      </label>
                      <span className="text-lg font-bold" style={{ color: 'var(--success-green)' }}>
                        {selectedTransaction.metadata?.depositData?.amount || selectedTransaction.amount || '0'} {selectedTransaction.currency}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Balance After
                      </label>
                      <span className="text-lg" style={{ color: 'var(--text-light)' }}>
                        {selectedTransaction.balance?.toLocaleString()} {selectedTransaction.currency}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Status
                      </label>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                        style={getStatusColor(selectedTransaction.status)}
                      >
                        {selectedTransaction.status}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                        Date
                      </label>
                      <span style={{ color: 'var(--text-light)' }}>
                        {formatDate(selectedTransaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                {selectedTransaction.user && (
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ 
                      background: 'var(--secondary-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                      User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                          User ID
                        </label>
                        <span style={{ color: 'var(--text-light)' }}>
                          {selectedTransaction.user.id}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                          Username
                        </label>
                        <span style={{ color: 'var(--text-light)' }}>
                          {selectedTransaction.user.username}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                          Email
                        </label>
                        <span style={{ color: 'var(--text-light)' }}>
                          {selectedTransaction.user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deposit Details */}
                {selectedTransaction.metadata?.depositData && (
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ 
                      background: 'var(--secondary-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                      Deposit Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(selectedTransaction.metadata.depositData).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium mb-2 capitalize" style={{ color: 'var(--text-dark)' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex items-center gap-2">
                            <span 
                              className={`text-sm ${key === 'fromAddress' || key === 'toAddress' || key === 'txId' || key === 'recordId' ? 'font-mono break-all' : ''}`}
                              style={{ color: 'var(--text-light)' }}
                            >
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                            </span>
                            {(key === 'fromAddress' || key === 'toAddress' || key === 'txId' || key === 'recordId') && (
                              <button
                                onClick={() => copyToClipboard(String(value))}
                                className="p-1 rounded hover:bg-purple-500/20 flex-shrink-0"
                              >
                                <ContentCopy style={{ fontSize: '16px', color: 'var(--accent-purple)' }} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Data */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-light)' }}>
                    Raw Transaction Data
                  </h3>
                  <div className="bg-black/20 p-4 rounded-lg overflow-x-auto">
                    <pre 
                      className="text-sm font-mono whitespace-pre-wrap"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {JSON.stringify(selectedTransaction, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
