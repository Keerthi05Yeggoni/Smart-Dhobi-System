import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa'
import { getBags, updateBag } from '../../services/bagService'
import { getItem, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import Button from '../../components/Button'

export default function Status(){
  const nav = useNavigate()
  const toast = useToast()
  const [bags, setBags] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    loadBags()
    const interval = setInterval(loadBags, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  function loadBags() {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'student') {
      nav('/')
      return
    }
    
    const allBags = getBags().filter(b => 
      b.studentRoll === session.id && b.status !== 'Picked Up'
    )
    setBags(allBags)
    setLoading(false)
  }

  function confirmPickup(bagId){
    if (!confirm('Confirm pickup for this bag?')) return
    
    try {
      updateBag(bagId, { 
        status: 'Picked Up', 
        pickupTimestamp: new Date().toISOString() 
      })
      toast.success('Bag pickup confirmed!')
      loadBags()
    } catch (err) {
      toast.error(err.message || 'Failed to confirm pickup')
    }
  }

  function getStatusIcon(status) {
    switch(status) {
      case 'Ready for Pickup':
        return <FaCheckCircle size={20} color="var(--success)" />
      case 'Drying':
      case 'Washing':
        return <FaSpinner size={20} color="var(--warning)" className="pulse" />
      default:
        return <FaClock size={20} color="var(--muted)" />
    }
  }

  function getStatusColor(status) {
    switch(status) {
      case 'Ready for Pickup':
        return 'var(--success)'
      case 'Drying':
        return 'var(--warning)'
      case 'Washing':
        return 'var(--accent)'
      default:
        return 'var(--muted)'
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <div className="sd-card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if(!bags.length) {
    return (
      <div className="container" style={{ marginTop: 24 }}>
        <div className="sd-card sd-card--light">
          <div style={{ textAlign: 'center', padding: 48 }}>
            <FaClock size={48} color="var(--muted)" style={{ marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>No Pending Bags</h3>
            <p className="small-muted">You don't have any bags in process right now.</p>
            <Button onClick={() => nav('/student/dropoff')} style={{ marginTop: 16 }}>
              Dropoff Laundry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Pending Bags</h2>
          <Button onClick={loadBags} className="ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaSpinner /> Refresh
          </Button>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    {getStatusIcon(b.status)}
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
                    <div className="small-muted">
                      <strong>Est. Pickup:</strong> {b.estimatedPickupDate || '—'}
                    </div>
                    <div className="small-muted">
                      <strong>Clothes Count:</strong> {b.declaredCount}
                    </div>
                    {b.assignedStaffId && (
                      <div className="small-muted">
                        <strong>Assigned Staff:</strong> {b.assignedStaffId}
                      </div>
                    )}
                  </div>
                </div>

                {b.status === 'Ready for Pickup' && (
                  <div>
                    <Button 
                      onClick={() => confirmPickup(b.bagId)}
                      style={{
                        background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <FaCheckCircle /> Confirm Pickup
                    </Button>
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
