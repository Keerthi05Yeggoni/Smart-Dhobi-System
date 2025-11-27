import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getBags } from '../../services/bagService'
import { getItem, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import { FaChartBar, FaTshirt, FaSpinner, FaCheckCircle } from 'react-icons/fa'

export default function AdminDashboard(){
  const nav = useNavigate()
  const toast = useToast()
  const [bags, setBags] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'admin') {
      nav('/')
      return
    }
    
    loadBags()
    const interval = setInterval(loadBags, 10000) // Auto-refresh every 10 seconds
    return () => clearInterval(interval)
  }, [nav])

  function loadBags() {
    setLoading(true)
    const allBags = getBags()
    setBags(allBags)
    setLoading(false)
  }

  const stats = {
    total: bags.length,
    inProcess: bags.filter(b => ['Washing', 'Drying'].includes(b.status)).length,
    ready: bags.filter(b => b.status === 'Ready for Pickup').length,
    picked: bags.filter(b => b.status === 'Picked Up').length,
    dropped: bags.filter(b => b.status === 'Dropped').length
  }

  const recentBags = bags
    .sort((a, b) => new Date(b.dropoffTimestamp) - new Date(a.dropoffTimestamp))
    .slice(0, 5)

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <FaChartBar size={24} color="#fff" />
            </div>
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          </div>
          <button 
            className="sd-btn ghost"
            onClick={loadBags}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FaSpinner /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          <div className="sd-card" style={{ textAlign: 'center', padding: 20, borderLeft: '4px solid var(--accent)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
              {stats.total}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Total Bags</div>
            <div className="small-muted" style={{ fontSize: 12 }}>All time</div>
          </div>
          
          <div className="sd-card" style={{ textAlign: 'center', padding: 20, borderLeft: '4px solid var(--warning)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>
              {stats.inProcess}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>In Process</div>
            <div className="small-muted" style={{ fontSize: 12 }}>Washing / Drying</div>
          </div>
          
          <div className="sd-card" style={{ textAlign: 'center', padding: 20, borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>
              {stats.ready}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Ready</div>
            <div className="small-muted" style={{ fontSize: 12 }}>Ready for Pickup</div>
          </div>
          
          <div className="sd-card" style={{ textAlign: 'center', padding: 20, borderLeft: '4px solid var(--accent-2)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-2)', marginBottom: 8 }}>
              {stats.picked}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Picked Up</div>
            <div className="small-muted" style={{ fontSize: 12 }}>Completed</div>
          </div>
          
          <div className="sd-card" style={{ textAlign: 'center', padding: 20, borderLeft: '4px solid var(--muted)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
              {stats.dropped}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Dropped</div>
            <div className="small-muted" style={{ fontSize: 12 }}>Awaiting Processing</div>
          </div>
        </div>

        {/* Recent Bags */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Recent Bags</h3>
          {loading ? (
            <div className="sd-card" style={{ textAlign: 'center', padding: 32 }}>
              <p>Loading...</p>
            </div>
          ) : recentBags.length === 0 ? (
            <div className="sd-card" style={{ textAlign: 'center', padding: 32 }}>
              <p className="small-muted">No bags yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {recentBags.map(b => (
                <div
                  key={b.bagId}
                  className="sd-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)'
                  }}
                  onClick={() => nav(`/admin/bag/${encodeURIComponent(b.bagId)}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.borderColor = 'var(--glass-border)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{b.bagId}</div>
                      <span className={`status-chip ${
                        b.status === 'Dropped' ? 'status-dropped' : 
                        b.status === 'Washing' ? 'status-washing' : 
                        b.status === 'Drying' ? 'status-drying' : 
                        'status-ready'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="small-muted">
                      {b.studentName} ({b.studentRoll}) • {new Date(b.dropoffTimestamp).toLocaleString()}
                    </div>
                  </div>
                  {b.status === 'Picked Up' && (
                    <FaCheckCircle size={24} color="var(--success)" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
