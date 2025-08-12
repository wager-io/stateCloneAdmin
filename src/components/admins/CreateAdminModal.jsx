import React from 'react';
import { Close } from '@mui/icons-material';

const CreateAdminModal = ({ 
  showModal, 
  onClose, 
  createForm, 
  setCreateForm, 
  onSubmit, 
  createLoading 
}) => {
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
        className="max-w-md w-full rounded-xl p-6 overflow-hidden relative scroll-y max-h-[90vh] flex flex-col"
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
            Create New Admin
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90" 
            style={{ 
              color: 'var(--text-light)',
            }}
          >
            <Close fontSize="small" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
              Username *
            </label>
            <input
              type="text"
              required
              value={createForm.username}
              onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={createForm.email}
              onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={createForm.firstName}
                onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={createForm.lastName}
                onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
              Password *
            </label>
            <input
              type="password"
              required
              value={createForm.password}
              onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)'
              }}
              placeholder="Min 8 chars, uppercase, lowercase, number, special char"
            />
          </div>

          <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
          Role
          </label>
          <select
          value={createForm.role}
          onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
          className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
          background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-light)'
          }}
          >
          <option value="admin" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Admin</option>
          <option value="super_admin" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Super Admin</option>
            <option value="moderator" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Moderator</option>
              <option value="support" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Support</option>
                </select>
              </div>

          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple), #8b5cf6)',
                color: 'white',
                border: '1px solid var(--accent-purple)'
              }}
            >
              {createLoading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
