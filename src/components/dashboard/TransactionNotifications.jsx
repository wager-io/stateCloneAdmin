import React from 'react';
import { Info, TrendingUp, TrendingDown } from '@mui/icons-material';
import ContentLoader from 'react-content-loader';

export default function TransactionNotifications({ transactions, loading }) {
  console.log(transactions)
  return (
    <div 
      className="rounded-xl p-6"
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
      <h3 
        className="text-xl font-semibold mb-6"
        style={{ 
          color: 'var(--text-light)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}
      >
        Recent Transactions
      </h3>
      
      <div className="space-y-3 pr-2">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              <ContentLoader 
                speed={2}
                width="100%"
                height={80}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                foregroundColor="rgba(255, 255, 255, 0.2)"
              >
                <circle cx="15" cy="20" r="5" />
                <rect x="30" y="15" rx="3" ry="3" width="80" height="12" />
                <rect x="130" y="15" rx="3" ry="3" width="100" height="12" />
                <rect x="0" y="40" rx="3" ry="3" width="60" height="10" />
                <rect x="80" y="40" rx="3" ry="3" width="80" height="10" />
                <rect x="180" y="40" rx="3" ry="3" width="50" height="10" />
                <rect x="250" y="15" rx="3" ry="3" width="80" height="15" />
              </ContentLoader>
            </div>
          ))
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => {
            const formatDate = (dateString) => {
              try {
                return new Date(dateString).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                });
              } catch {
                return dateString;
              }
            };

            return (
          <div 
            key={index}
            className="p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* User info */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: transaction.status === 'Completed' ? 'var(--success-green)' : '#ffa726'
                    }}
                  />
                  <span 
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    {transaction.userId || transaction.id}
                  </span>
                  <span 
                    className="font-medium"
                    style={{ color: 'var(--text-light)' }}
                  >
                    {transaction.username}
                  </span>
                </div>
                
                {/* Transaction details */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {transaction.type === 'Deposit' ? (
                      <TrendingUp style={{ color: 'var(--success-green)', fontSize: '16px' }} />
                    ) : (
                      <TrendingDown style={{ color: '#ff6b6b', fontSize: '16px' }} />
                    )}
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Deposit' 
                          ? 'text-green-300' 
                          : 'text-orange-300'
                      }`}
                      style={{
                        background: transaction.type === 'Deposit' 
                          ? 'rgba(0, 230, 118, 0.15)' 
                          : 'rgba(255, 107, 107, 0.15)',
                        border: `1px solid ${transaction.type === 'Deposit' ? 'var(--success-green)' : '#ff6b6b'}`
                      }}
                    >
                      {transaction.type}
                    </span>
                  </div>
                  
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    {formatDate(transaction.date)}
                  </span>
                  
                  <span 
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      transaction.status === 'completed' 
                        ? 'text-green-400' 
                        : transaction.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                    style={{
                      background: transaction.status === 'completed' 
                        ? 'rgba(0, 230, 118, 0.1)' 
                        : transaction.status === 'pending'
                        ? 'rgba(255, 193, 7, 0.1)'
                        : 'rgba(244, 67, 54, 0.1)'
                    }}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
              
              {/* Amount and action */}
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <div 
                    className="font-bold text-lg"
                    style={{ color: 'var(--text-light)' }}
                  >
                    {transaction.metadata?.depositData?.amount} {transaction.metadata?.depositData?.coinSymbol}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    {transaction.metadata?.depositData?.chain}
                  </div>
                </div>
                
                <button 
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ 
                    color: 'var(--accent-purple)',
                    background: 'rgba(106, 13, 173, 0.1)',
                    border: '1px solid var(--accent-purple)'
                  }}
                  title="View Transaction Details"
                >
                  <Info fontSize="small" />
                </button>
              </div>
            </div>
          </div>
            );
          })
        ) : (
          // Empty state
          <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div 
                className="text-6xl opacity-30"
                style={{ color: 'var(--text-dark)' }}
              >
                💸
              </div>
              <p 
                className="text-lg font-medium"
                style={{ color: 'var(--text-dark)' }}
              >
                No transactions found
              </p>
              <p 
                className="text-sm"
                style={{ color: 'var(--text-dark)' }}
              >
                Recent transactions will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
