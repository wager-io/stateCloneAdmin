
import React, { useState, useEffect } from 'react';
import { 
  SportsEsports, 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  Settings,
  BarChart,
  Casino,
  KeyboardArrowDown,
  Save
} from '@mui/icons-material';
import api from '../api/axios';

export default function GameReports() {
  const [selectedGame, setSelectedGame] = useState('');
  const [gameStats, setGameStats] = useState(null);
  const [gameSettings, setGameSettings] = useState({
    maxPayout: '',
    minBetAmount: ''
  });
  const [loading, setLoading] = useState(false);

  // Available games list
  const gamesList = [
    { id: 'dice', name: 'Dice', icon: '🎲' },
    { id: 'crash', name: 'Crash', icon: '🚀' },
    { id: 'hilo', name: 'HiLo', icon: '📈' },
    { id: 'plinko', name: 'Plinko', icon: '🎯' },
    { id: 'limbo', name: 'Limbo', icon: '🔥' },
    { id: 'mines', name: 'Mines', icon: '💣' }
  ];

  // Mock game settings - replace with actual API when available
  const mockGameSettings = {
    maxPayout: 10000,
    minBetAmount: 1
  };

  useEffect(() => {
    if (selectedGame) {
      fetchGameStats(selectedGame);
    }
  }, [selectedGame]);

  const fetchGameStats = async (gameType) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/transactions/game-reports', {
        params: { gameType }
      });
      
      if (response.success) {
        setGameStats(response.data);
        setGameSettings(mockGameSettings); // Use mock until settings API is available
      }
    } catch (error) {
      console.error('Error fetching game stats:', error);
      // Fallback to show empty state or error message
      setGameStats(null);
    }
    setLoading(false);
  };

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setGameStats(null);
  };

  const handleSettingsChange = (field, value) => {
    setGameSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', gameSettings);
    // Implement API call to save settings
  };

  const getSelectedGameInfo = () => {
    return gamesList.find(game => game.id === selectedGame);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--primary-bg)' }}>

      {/* Game Selection Dropdown */}
      <div className="mb-8">
        <div 
          className="relative max-w-md"
        >
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-light)' }}
          >
            Select Game
          </label>
          <div className="relative">
            <select
              value={selectedGame}
              onChange={(e) => handleGameSelect(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '14px'
              }}
            >
              <option 
                value="" 
                style={{ 
                  background: '#1a1d2e', 
                  color: 'white' 
                }}
              >
                Choose a game...
              </option>
              {gamesList.map(game => (
                <option 
                  key={game.id} 
                  value={game.id}
                  style={{ 
                    background: '#1a1d2e', 
                    color: 'white' 
                  }}
                >
                  {game.icon} {game.name}
                </option>
              ))}
            </select>
            <KeyboardArrowDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-dark)' }}
            />
          </div>
        </div>
      </div>

      {/* Game Content */}
      {selectedGame && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Game Statistics */}
          <div className="xl:col-span-2">
            <div 
              className="rounded-xl p-3 mb-6"
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
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-3 rounded-lg"
                  style={{
                    background: 'linear-gradient(145deg, var(--accent-purple), #8b3db8)',
                    boxShadow: '0 8px 16px rgba(106, 13, 173, 0.4)'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>
                    {getSelectedGameInfo()?.icon}
                  </span>
                </div>
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: 'var(--text-light)' }}
                  >
                    {getSelectedGameInfo()?.name} Statistics
                  </h2>
                  <p style={{ color: 'var(--text-dark)' }}>
                    Current month performance metrics
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg animate-pulse"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div 
                        className="h-4 rounded mb-2"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      ></div>
                      <div 
                        className="h-8 rounded"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      ></div>
                    </div>
                  ))}
                </div>
              ) : gameStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                  {/* Total Wager */}
                  <div 
                    className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AttachMoney style={{ color: 'var(--accent-purple)', fontSize: '20px' }} />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        Total Wager
                      </span>
                    </div>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--text-light)' }}
                    >
                      ${gameStats.totalWager.toLocaleString()}
                    </p>
                  </div>

                  {/* Total Bets */}
                  <div 
                    className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Casino style={{ color: '#3b82f6', fontSize: '20px' }} />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        All Bet Amounts
                      </span>
                    </div>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {gameStats.totalBetsThisMonth.toLocaleString()}
                    </p>
                  </div>

                  {/* Total Wins */}
                  <div 
                    className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp style={{ color: 'var(--success-green)', fontSize: '20px' }} />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        Total Wins
                      </span>
                    </div>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--success-green)' }}
                    >
                      {gameStats.totalWins.toLocaleString()}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {gameStats.winRate}% win rate
                    </p>
                  </div>

                  {/* Total Losses */}
                  <div 
                    className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown style={{ color: '#ef4444', fontSize: '20px' }} />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        Total Losses
                      </span>
                    </div>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: '#ef4444' }}
                    >
                      {gameStats.totalLosses.toLocaleString()}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {(100 - gameStats.winRate).toFixed(1)}% loss rate
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Metrics */}
              {gameStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(106, 13, 173, 0.1)',
                      border: '1px solid var(--accent-purple)'
                    }}
                  >
                    <h4 
                      className="text-lg font-semibold mb-2"
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      House Edge
                    </h4>
                    <p 
                      className="text-xl font-bold"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {gameStats.houseEdge}%
                    </p>
                  </div>
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid var(--success-green)'
                    }}
                  >
                    <h4 
                      className="text-lg font-semibold mb-2"
                      style={{ color: 'var(--success-green)' }}
                    >
                      Revenue
                    </h4>
                    <p 
                      className="text-xl font-bold"
                      style={{ color: 'var(--text-light)' }}
                    >
                      ${gameStats.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Settings */}
          <div className="xl:col-span-1">
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
              <div className="flex items-center gap-3 mb-6">
                <Settings style={{ color: 'var(--accent-purple)', fontSize: '24px' }} />
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: 'var(--text-light)' }}
                >
                  Game Settings
                </h3>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div 
                        className="h-4 rounded mb-2"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      ></div>
                      <div 
                        className="h-10 rounded"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      ></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Max Payout */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-light)' }}
                    >
                      Max Payout ($)
                    </label>
                    <input
                      type="number"
                      value={gameSettings.maxPayout}
                      onChange={(e) => handleSettingsChange('maxPayout', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{
                        background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-light)'
                      }}
                      placeholder="Enter max payout amount"
                    />
                  </div>

                  {/* Min Bet Amount */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-light)' }}
                    >
                      Min Bet Amount ($)
                    </label>
                    <input
                      type="number"
                      value={gameSettings.minBetAmount}
                      onChange={(e) => handleSettingsChange('minBetAmount', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{
                        background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-light)'
                      }}
                      placeholder="Enter min bet amount"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveSettings}
                    className="w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(145deg, var(--accent-purple), #8b3db8)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 8px 16px rgba(106, 13, 173, 0.4)'
                    }}
                  >
                    <Save fontSize="small" />
                    Save Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedGame && (
        <div 
          className="rounded-xl p-12 text-center"
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
          <SportsEsports 
            style={{ 
              fontSize: '64px', 
              color: 'var(--accent-purple)', 
              opacity: 0.5,
              marginBottom: '16px'
            }} 
          />
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-light)' }}
          >
            Select a Game to View Reports
          </h3>
          <p 
            style={{ color: 'var(--text-dark)' }}
          >
            Choose a game from the dropdown above to view detailed statistics and manage settings
          </p>
        </div>
      )}
    </div>
  );
}
