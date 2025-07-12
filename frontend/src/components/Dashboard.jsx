import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css';

const Dashboard = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const recentTransactions = transactions.slice(0, 3)

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  // Find center for the map (use first transaction with location, or fallback)
  const firstLoc = recentTransactions.find(t => t.location && t.location.lat && t.location.lng);
  const mapCenter = firstLoc ? [firstLoc.location.lat, firstLoc.location.lng] : [20.5937, 78.9629]; // Default: India

  // Helper: Offset markers with duplicate locations
  const getOffsetLocations = (transactions) => {
    const seen = {};
    return transactions.map(t => {
      if (t.location && t.location.lat && t.location.lng) {
        const key = `${t.location.lat},${t.location.lng}`;
        if (!seen[key]) seen[key] = 0;
        else seen[key] += 1;
        // Offset by up to ±0.0002 per duplicate (about 20m)
        const offset = seen[key] * 0.0002;
        const angle = (seen[key] * 137.5) % 360; // spiral out
        const latOffset = Math.cos(angle) * offset;
        const lngOffset = Math.sin(angle) * offset;
        return {
          ...t,
          location: {
            ...t.location,
            lat: t.location.lat + latOffset,
            lng: t.location.lng + lngOffset
          }
        };
      }
      return t;
    });
  };

  const offsetRecentTransactions = getOffsetLocations(recentTransactions);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '0 0 48px 0',
      fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* Header Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: 32, 
                fontWeight: 800, 
                color: '#ffffff', 
                margin: 0,
                background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Financial Dashboard
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: 16, 
                fontWeight: 400, 
                margin: '4px 0 0 0' 
              }}>
                Real-time financial insights and analytics
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: 500 }}>
                Last Updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0 24px' }}>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 24, 
          marginBottom: 40 
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 20, 
            padding: 28,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 8
                }}>
                  Total Income
                </div>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: '#10b981',
                  marginBottom: 4
                }}>
                  ₹{totalIncome.toLocaleString()}
                </div>
                <div style={{ 
                  color: 'rgba(16, 185, 129, 0.8)', 
                  fontSize: 13, 
                  fontWeight: 500 
                }}>
                  +12.5% from last month
                </div>
              </div>
              <div style={{ 
                fontSize: 40,
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                borderRadius: '16px',
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
              }}>
                📈
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 20, 
            padding: 28,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 8
                }}>
                  Total Expenses
                </div>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: '#ef4444',
                  marginBottom: 4
                }}>
                  ₹{totalExpense.toLocaleString()}
                </div>
                <div style={{ 
                  color: 'rgba(239, 68, 68, 0.8)', 
                  fontSize: 13, 
                  fontWeight: 500 
                }}>
                  -8.2% from last month
                </div>
              </div>
              <div style={{ 
                fontSize: 40,
                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                borderRadius: '16px',
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
              }}>
                📉
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 20, 
            padding: 28,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: balance >= 0 ? 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)' : 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 8
                }}>
                  Net Balance
                </div>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: balance >= 0 ? '#8b5cf6' : '#f59e0b',
                  marginBottom: 4
                }}>
                  ₹{balance.toLocaleString()}
                </div>
                <div style={{ 
                  color: balance >= 0 ? 'rgba(139, 92, 246, 0.8)' : 'rgba(245, 158, 11, 0.8)', 
                  fontSize: 13, 
                  fontWeight: 500 
                }}>
                  {balance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                </div>
              </div>
              <div style={{ 
                fontSize: 40,
                background: balance >= 0 ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                borderRadius: '16px',
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: balance >= 0 ? '0 8px 32px rgba(139, 92, 246, 0.3)' : '0 8px 32px rgba(245, 158, 11, 0.3)'
              }}>
                {balance >= 0 ? '💎' : '⚠️'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 32, 
          alignItems: 'start' 
        }}>
          
          {/* Transaction Map */}
          <div style={{ 
            gridColumn: 'span 2',
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 24, 
            padding: 32,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 24, 
                margin: 0,
                marginBottom: 8
              }}>
                Transaction Geography
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: 14, 
                margin: 0 
              }}>
                Geographic distribution of your recent transactions
              </p>
            </div>
            <div style={{ 
              height: 400, 
              width: '100%', 
              borderRadius: 16, 
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {offsetRecentTransactions.filter(t => t.location && t.location.lat && t.location.lng).map(t => (
                  <Marker key={t._id || t.id} position={[t.location.lat, t.location.lng]}>
                    <Popup>
                      <div>
                        <strong>{t.category}</strong><br />
                        {t.description}<br />
                        ₹{t.amount} ({t.type})
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 24, 
            padding: 32,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 24, 
                margin: 0,
                marginBottom: 8
              }}>
                Recent Activity
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: 14, 
                margin: 0 
              }}>
                Your latest financial transactions
              </p>
            </div>
            {recentTransactions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {offsetRecentTransactions.map(transaction => (
                  <div key={transaction._id || transaction.id} style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    padding: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: '#ffffff', 
                          fontSize: 16,
                          marginBottom: 4
                        }}>
                          {transaction.category}
                        </div>
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: 14,
                          marginBottom: 8
                        }}>
                          {transaction.description}
                        </div>
                        {transaction.location && transaction.location.lat && transaction.location.lng && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: '#60a5fa', 
                            fontSize: 12,
                            gap: 4
                          }}>
                            <span>📍</span>
                            <span>{transaction.location.lat.toFixed(5)}, {transaction.location.lng.toFixed(5)}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        fontWeight: 800, 
                        fontSize: 18,
                        color: transaction.type === 'income' ? '#10b981' : '#ef4444',
                        textAlign: 'right'
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 16,
                padding: 40
              }}>
                No transactions yet
              </div>
            )}
          </div>

          {/* Expense Breakdown */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: 24, 
            padding: 32,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 24, 
                margin: 0,
                marginBottom: 8
              }}>
                Expense Analysis
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: 14, 
                margin: 0 
              }}>
                Breakdown of your spending categories
              </p>
            </div>
            {Object.keys(expenseByCategory).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {Object.entries(expenseByCategory).map(([category, amount]) => (
                  <div key={category}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 8
                    }}>
                      <span style={{ 
                        fontWeight: 600, 
                        color: '#ffffff', 
                        fontSize: 16 
                      }}>
                        {category}
                      </span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: '#a855f7', 
                        fontSize: 16 
                      }}>
                        ₹{amount.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: 10, 
                      height: 10, 
                      width: '100%',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: 'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)',
                        height: '100%',
                        borderRadius: 10,
                        width: `${(amount / totalExpense) * 100}%`,
                        transition: 'width 0.6s ease',
                        boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)'
                      }}></div>
                    </div>
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      fontSize: 12, 
                      marginTop: 4,
                      textAlign: 'right'
                    }}>
                      {((amount / totalExpense) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 16,
                padding: 40
              }}>
                No expenses yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import Footer from './Footer';

const DashboardWithFooter = (props) => (
  <>
    <Dashboard {...props} />
    <Footer />
  </>
);

export default DashboardWithFooter;