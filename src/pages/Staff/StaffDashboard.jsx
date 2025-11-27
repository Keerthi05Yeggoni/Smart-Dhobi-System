import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getBags, assignBag } from '../../services/bagService'
import { getItem, setItem, STORAGE_KEYS, initDefaults, SESSION_KEY } from '../../services/storage'
import ScanSimulator from '../../components/ScanSimulator'
import Button from '../../components/Button'
import { FiTarget, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi'
import { useToast } from '../../components/Toast'

export default function StaffDashboard(){
  const nav = useNavigate()
  const toast = useToast()
  const [bags, setBags] = React.useState([])
  const [query, setQuery] = React.useState('')
  const [scanOpen, setScanOpen] = React.useState(false)
  const [session, setSession] = React.useState(getItem(SESSION_KEY))
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const currentSession = getItem(SESSION_KEY)
    if (!currentSession || currentSession.role !== 'staff') {
      nav('/')
      return
    }

    initDefaults()
    const staffs = getItem(STORAGE_KEYS.STAFF) || []
    if(!staffs.length){
      const defaultStaff = { id:'staff-1', username:'staff1', displayName:'Staff One', active:true }
      setItem(STORAGE_KEYS.STAFF, [defaultStaff])
      setSession({ role:'staff', id: defaultStaff.id, name: defaultStaff.displayName })
    }
    loadBags()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadBags, 10000)
    return () => clearInterval(interval)
  }, [nav])

  function loadBags(){
    setLoading(true)
    const all = getBags()
    all.sort((a,b) => new Date(b.dropoffTimestamp) - new Date(a.dropoffTimestamp))
    setBags(all)
    setLoading(false)
  }

  function openBag(bagId){ 
    nav(`/staff/bag/${encodeURIComponent(bagId)}`) 
  }

  function onScan(id){
    if(!id) return
    const found = getBags().find(b => b.bagId === id)
    if(found) {
      openBag(found.bagId)
      toast.success('Bag found!')
    } else {
      toast.error('Bag not found: ' + id)
    }
  }

  function handleAssign(bagId){
    if(!session) {
      toast.error('Please login as staff first')
      return
    }
    try{
      assignBag(bagId, session.id)
      toast.success('Bag assigned to you!')
      loadBags()
    } catch(err) {
      toast.error(err.message || 'Failed to assign bag')
    }
  }

  const filtered = bags.filter(b => {
    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    
    // Search filter
    if(!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      (b.bagId && b.bagId.toLowerCase().includes(q)) || 
      (b.studentRoll && b.studentRoll.toLowerCase().includes(q)) || 
      (b.studentName && b.studentName.toLowerCase().includes(q))
    )
  })

  const stats = {
    total: bags.length,
    dropped: bags.filter(b => b.status === 'Dropped').length,
    washing: bags.filter(b => b.status === 'Washing').length,
    drying: bags.filter(b => b.status === 'Drying').length,
    ready: bags.filter(b => b.status === 'Ready for Pickup').length
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Staff Dashboard</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button onClick={loadBags} className="ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiRefreshCw /> Refresh
            </Button>
            <Button onClick={() => setScanOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiSearch /> Scan Bag
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
          marginBottom: 24
        }}>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
              {stats.total}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Total</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
              {stats.dropped}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Dropped</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
              {stats.washing}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Washing</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--warning)', marginBottom: 4 }}>
              {stats.drying}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Drying</div>
          </div>
          <div className="sd-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
              {stats.ready}
            </div>
            <div className="small-muted" style={{ fontSize: 12 }}>Ready</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              placeholder="Search by Bag ID, Roll number, or Name"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="sd-input"
              style={{ width: '100%' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="sd-input"
            style={{ padding: '10px 16px', fontSize: 14, cursor: 'pointer', minWidth: 150 }}
          >
            <option value="all">All Status</option>
            <option value="Dropped">Dropped</option>
            <option value="Washing">Washing</option>
            <option value="Drying">Drying</option>
            <option value="Ready for Pickup">Ready</option>
          </select>
        </div>

        {/* Bag List */}
        <div style={{ display: 'grid', gap: 12 }}>
          {loading ? (
            <div className="sd-card" style={{ textAlign: 'center', padding: 32 }}>
              <p>Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="sd-card" style={{ textAlign: 'center', padding: 32 }}>
              <p className="small-muted">No bags found.</p>
            </div>
          ) : (
            filtered.map(b => (
              <div 
                key={b.bagId} 
                className="sd-card" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                  borderLeft: `4px solid ${
                    b.status === 'Ready for Pickup' ? 'var(--success)' :
                    b.status === 'Drying' ? 'var(--warning)' :
                    b.status === 'Washing' ? 'var(--accent)' :
                    'var(--muted)'
                  }`
                }}
              >
                <div style={{ flex: 1, minWidth: 250 }}>
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
                    {b.assignedStaffId && (
                      <span className="badge" style={{ fontSize: 11 }}>
                        Assigned: {b.assignedStaffId}
                      </span>
                    )}
                  </div>
                  <div className="small-muted" style={{ marginBottom: 4 }}>
                    {b.studentName} — {b.studentRoll} • Hostel {b.hostelBlock} {b.room}
                  </div>
                  <div className="small-muted" style={{ fontSize: 12 }}>
                    Declared: {b.declaredCount} • {new Date(b.dropoffTimestamp).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {!b.assignedStaffId && (
                    <Button 
                      onClick={() => handleAssign(b.bagId)} 
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <FiTarget /> Assign
                    </Button>
                  )}
                  <Button 
                    onClick={() => openBag(b.bagId)} 
                    className="ghost"
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <ScanSimulator open={scanOpen} onClose={() => setScanOpen(false)} onScan={onScan} />
      </div>
    </div>
  )
}
