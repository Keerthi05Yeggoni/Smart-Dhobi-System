import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTshirt, FaClock, FaHistory } from 'react-icons/fa'
import { getItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { getBags } from '../../services/bagService'

export default function StudentDashboard(){
  const nav = useNavigate()
  const [student, setStudent] = React.useState(null)
  const [stats, setStats] = React.useState({ total: 0, pending: 0, ready: 0, completed: 0 })
  
  React.useEffect(() => {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'student') {
      nav('/')
      return
    }
    
    const students = getItem(STORAGE_KEYS.STUDENTS) || []
    const found = students.find(s => s.roll === session.id)
    setStudent(found || null)
    
    // Load stats
    const bags = getBags().filter(b => b.studentRoll === session.id)
    setStats({
      total: bags.length,
      pending: bags.filter(b => ['Dropped', 'Washing', 'Drying'].includes(b.status)).length,
      ready: bags.filter(b => b.status === 'Ready for Pickup').length,
      completed: bags.filter(b => b.status === 'Picked Up').length
    })
  }, [nav])
  
  if (!student) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <div className="sd-card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0
          }}>
            <FaTshirt size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, marginBottom: 4 }}>Welcome, {student.name || 'Student'}</h2>
            <p className="small-muted" style={{ margin: 0 }}>
              {student.roll} • {student.hostelBlock} — Room {student.room}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 24
        }}>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
              {stats.total}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Total Bags</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--warning)', marginBottom: 4 }}>
              {stats.pending}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>In Process</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
              {stats.ready}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Ready</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-2)', marginBottom: 4 }}>
              {stats.completed}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Completed</div>
          </div>
        </div>

      </div>

      {/* Three Separate Action Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: 20,
        marginTop: 24,
        flexWrap: 'wrap'
      }}>
        <div
          onClick={() => nav('/student/dropoff')}
          className="sd-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 32,
            cursor: 'pointer',
            border: '1.5px solid var(--glass-border)',
            transition: 'all var(--transition-base)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            flex: '1 1 300px',
            minWidth: 260,
            maxWidth: 350,
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--glass-border)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: 8
          }}>
            <FaTshirt size={28} color="#fff" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: 'var(--text)' }}>Dropoff Laundry</div>
          <div className="small-muted" style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.5 }}>
            Submit your laundry bag
          </div>
        </div>

        <div
          onClick={() => nav('/student/status')}
          className="sd-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 32,
            cursor: 'pointer',
            border: '1.5px solid var(--glass-border)',
            transition: 'all var(--transition-base)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            flex: '1 1 300px',
            minWidth: 260,
            maxWidth: 350,
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.borderColor = 'var(--warning)'
            e.currentTarget.style.boxShadow = 'var(--shadow-xl), 0 0 24px rgba(245, 158, 11, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--glass-border)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--warning) 0%, var(--warning-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
            marginBottom: 8
          }}>
            <FaClock size={28} color="#fff" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: 'var(--text)' }}>Check Status</div>
          <div className="small-muted" style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.5 }}>
            Track your laundry
          </div>
        </div>

        <div
          onClick={() => nav('/student/history')}
          className="sd-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 32,
            cursor: 'pointer',
            border: '1.5px solid var(--glass-border)',
            transition: 'all var(--transition-base)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            flex: '1 1 300px',
            minWidth: 260,
            maxWidth: 350,
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.borderColor = 'var(--accent-2)'
            e.currentTarget.style.boxShadow = 'var(--shadow-xl), 0 0 24px rgba(14, 165, 233, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--glass-border)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent-2-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.25)',
            marginBottom: 8
          }}>
            <FaHistory size={28} color="#fff" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: 'var(--text)' }}>History</div>
          <div className="small-muted" style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.5 }}>
            View past orders
          </div>
        </div>
      </div>
    </div>
  )
}
