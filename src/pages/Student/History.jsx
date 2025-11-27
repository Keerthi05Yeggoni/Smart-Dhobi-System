import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHistory, FaCheckCircle, FaFilter } from 'react-icons/fa'
import { getBags } from '../../services/bagService'
import { getItem, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'

export default function History(){
  const nav = useNavigate()
  const toast = useToast()
  const [bags, setBags] = React.useState([])
  const [filter, setFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')
  
  React.useEffect(() => {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'student') {
      nav('/')
      return
    }
    
    let allBags = getBags().filter(b => b.studentRoll === session.id)
    
    // Apply filter
    if (filter === 'completed') {
      allBags = allBags.filter(b => b.status === 'Picked Up')
    } else if (filter === 'active') {
      allBags = allBags.filter(b => b.status !== 'Picked Up')
    }
    
    // Apply sort
    if (sortBy === 'newest') {
      allBags.sort((a, b) => new Date(b.dropoffTimestamp) - new Date(a.dropoffTimestamp))
    } else if (sortBy === 'oldest') {
      allBags.sort((a, b) => new Date(a.dropoffTimestamp) - new Date(b.dropoffTimestamp))
    }
    
    setBags(allBags)
  }, [filter, sortBy, nav])

  function getStatusColor(status) {
    switch(status) {
      case 'Picked Up':
        return 'var(--success)'
      case 'Ready for Pickup':
        return 'var(--success-light)'
      case 'Drying':
        return 'var(--warning)'
      case 'Washing':
        return 'var(--accent)'
      default:
        return 'var(--muted)'
    }
  }

  if(!bags.length) {
    return (
      <div className="container" style={{ marginTop: 24 }}>
        <div className="sd-card sd-card--light">
          <div style={{ textAlign: 'center', padding: 48 }}>
            <FaHistory size={48} color="var(--muted)" style={{ marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>No History</h3>
            <p className="small-muted">You haven't dropped off any laundry yet.</p>
            <button 
              className="sd-btn" 
              onClick={() => nav('/student/dropoff')}
              style={{ marginTop: 16 }}
            >
              Dropoff Laundry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Order History</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="sd-input"
              style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
            >
              <option value="all">All Orders</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sd-input"
              style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {bags.map(b => (
            <div 
              key={b.bagId} 
              className="sd-card"
              style={{
                borderLeft: `4px solid ${getStatusColor(b.status)}`,
                transition: 'all var(--transition-base)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{b.bagId}</div>
                    <span 
                      className="status-chip"
                      style={{
                        background: `linear-gradient(135deg, ${getStatusColor(b.status)}20, ${getStatusColor(b.status)}15)`,
                        color: getStatusColor(b.status),
                        borderColor: `${getStatusColor(b.status)}40`
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                    <div className="small-muted">
                      <strong>Dropoff:</strong> {new Date(b.dropoffTimestamp).toLocaleString()}
                    </div>
                    {b.pickupTimestamp && (
                      <div className="small-muted">
                        <strong>Pickup:</strong> {new Date(b.pickupTimestamp).toLocaleString()}
                      </div>
                    )}
                    <div className="small-muted">
                      <strong>Clothes Count:</strong> {b.declaredCount}
                    </div>
                    {b.estimatedPickupDate && (
                      <div className="small-muted">
                        <strong>Est. Pickup:</strong> {b.estimatedPickupDate}
                      </div>
                    )}
                  </div>
                </div>

                {b.status === 'Picked Up' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)' }}>
                    <FaCheckCircle size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
