import React from 'react';
import { Close } from '@mui/icons-material';

const CreateUserModal = ({ 
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
            Create New User
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

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="user@example.com"
              />
            </div>

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
                placeholder="unique_username"
              />
            </div>

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
                placeholder="First Name"
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
                placeholder="Last Name"
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
              placeholder="Min 8 characters with uppercase, lowercase, number"
            />
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                Country
              </label>
              <input
                type="text"
                value={createForm.country || ''}
                onChange={(e) => setCreateForm({...createForm, country: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                State
              </label>
              <input
                type="text"
                value={createForm.state || ''}
                onChange={(e) => setCreateForm({...createForm, state: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
                placeholder="State/Province"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                City
              </label>
              <input
                type="text"
                value={createForm.city || ''}
                onChange={(e) => setCreateForm({...createForm, city: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                Postal Code
              </label>
              <input
                type="text"
                value={createForm.postalCode || ''}
                onChange={(e) => setCreateForm({...createForm, postalCode: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
                placeholder="Postal Code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={createForm.dateOfBirth || ''}
                onChange={(e) => setCreateForm({...createForm, dateOfBirth: e.target.value})}
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
                Language
              </label>
              <select
                value={createForm.language || 'English'}
                onChange={(e) => setCreateForm({...createForm, language: e.target.value})}
                className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-light)'
                }}
              >
                <option value="English" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>English</option>
                <option value="Spanish" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Spanish</option>
                <option value="French" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>French</option>
                <option value="German" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>German</option>
                <option value="Portuguese" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Portuguese</option>
                <option value="Italian" style={{ background: '#1a1d2e', color: 'var(--text-light)' }}>Italian</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
              Resident Address
            </label>
            <textarea
              value={createForm.residentAddress || ''}
              onChange={(e) => setCreateForm({...createForm, residentAddress: e.target.value})}
              rows={3}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)'
              }}
              placeholder="Full residential address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(148, 163, 184, 0.1)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)'
              }}
            >
              Cancel
            </button>
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
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
