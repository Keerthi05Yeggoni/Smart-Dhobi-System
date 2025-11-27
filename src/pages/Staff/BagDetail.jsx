import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBagById, updateBag, assignBag, recordStage } from '../../services/bagService'
import { getItem, SESSION_KEY } from '../../services/storage'
import Button from '../../components/Button'
import AuditTimeline from '../../components/AuditTimeline'
import { useToast } from '../../components/Toast'
import { FaArrowLeft, FaTshirt, FaSpinner, FaCheckCircle } from 'react-icons/fa'
import Modal from '../../components/Modal'
import Input from '../../components/Input'

export default function BagDetail(){
  const { bagId } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const [bag, setBag] = React.useState(null)
  const [session, setSession] = React.useState(getItem(SESSION_KEY))
  const [countModal, setCountModal] = React.useState({ open: false, stage: null, count: '' })

  React.useEffect(() => {
    const currentSession = getItem(SESSION_KEY)
    if (!currentSession || currentSession.role !== 'staff') {
      nav('/')
      return
    }
    
    loadBag()
    setSession(currentSession)
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadBag, 5000)
    return () => clearInterval(interval)
  }, [bagId, nav])

  function loadBag() {
    const bagData = getBagById(bagId)
    setBag(bagData)
  }

  function canAct(){
    if(!bag) return false
    if(!session) return false
    if(!bag.assignedStaffId) return true
    return bag.assignedStaffId === session.id
  }

  function handleAssign(){
    if(!session) {
      toast.error('Please login as staff first')
      return
    }
    try{
      assignBag(bag.bagId, session.id)
      toast.success('Bag assigned to you!')
      loadBag()
    } catch(err) {
      toast.error(err.message || 'Failed to assign bag')
    }
  }

  function openCountModal(stage) {
    setCountModal({ open: true, stage, count: String(bag.declaredCount || 0) })
  }

  function handleStageUpdate() {
    if (!canAct()) {
      toast.error('This bag is assigned to another staff member')
      return
    }

    const count = Number(countModal.count)
    if (!Number.isInteger(count) || count < 0) {
      toast.error('Enter a valid positive integer count')
      return
    }

    try {
      recordStage(bag.bagId, countModal.stage, session.id, count)
      toast.success(`Bag moved to ${countModal.stage} stage!`)
      setCountModal({ open: false, stage: null, count: '' })
      loadBag()
    } catch (err) {
      toast.error(err.message || 'Failed to update stage')
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

  if(!bag) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <div className="sd-card">
          <p>Bag not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="sd-btn ghost"
              onClick={() => nav('/staff/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <FaArrowLeft /> Back
            </button>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <FaTshirt size={20} color="#fff" />
            </div>
            <h2 style={{ margin: 0 }}>Bag {bag.bagId}</h2>
            <span 
              className="status-chip"
              style={{
                background: `linear-gradient(135deg, ${getStatusColor(bag.status)}20, ${getStatusColor(bag.status)}15)`,
                color: getStatusColor(bag.status),
                borderColor: `${getStatusColor(bag.status)}40`
              }}
            >
              {bag.status}
            </span>
          </div>
        </div>

        {/* Bag Info */}
        <div className="sd-card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Bag Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Student</div>
              <div style={{ fontWeight: 600 }}>{bag.studentName} ({bag.studentRoll})</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Hostel</div>
              <div style={{ fontWeight: 600 }}>{bag.hostelBlock} — Room {bag.room}</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Contact</div>
              <div style={{ fontWeight: 600 }}>{bag.contact || '—'}</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Dropoff</div>
              <div style={{ fontWeight: 600 }}>{new Date(bag.dropoffTimestamp).toLocaleString()}</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Est. Pickup</div>
              <div style={{ fontWeight: 600 }}>{bag.estimatedPickupDate || '—'}</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Declared Count</div>
              <div style={{ fontWeight: 600 }}>{bag.declaredCount}</div>
            </div>
            <div>
              <div className="small-muted" style={{ marginBottom: 4 }}>Assigned Staff</div>
              <div style={{ fontWeight: 600 }}>{bag.assignedStaffId || '—'}</div>
            </div>
          </div>
        </div>

        {/* Count History */}
        {bag.countHistory && bag.countHistory.length > 0 && (
          <div className="sd-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Clothes Count History</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {bag.countHistory.map((c, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    background: 'var(--glass)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.stage}</div>
                    <div className="small-muted" style={{ fontSize: 12 }}>
                      {new Date(c.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
                    {c.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!bag.assignedStaffId && (
              <Button onClick={handleAssign} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCheckCircle /> Assign to me
              </Button>
            )}
            {(bag.status === 'Dropped' || bag.status === 'In-Process') && (
              <Button 
                onClick={() => openCountModal('Washing')}
                disabled={!canAct()}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <FaSpinner /> Start Washing
              </Button>
            )}
            {bag.status === 'Washing' && (
              <Button 
                onClick={() => openCountModal('Drying')}
                disabled={!canAct()}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Move to Drying
              </Button>
            )}
            {bag.status === 'Drying' && (
              <Button 
                onClick={() => {
                  if (!canAct()) {
                    toast.error('This bag is assigned to another staff member')
                    return
                  }
                  try {
                    recordStage(bag.bagId, 'Ready for Pickup', session.id, bag.declaredCount)
                    toast.success('Bag is now ready for pickup!')
                    loadBag()
                  } catch (err) {
                    toast.error(err.message || 'Failed to finish drying')
                  }
                }}
                disabled={!canAct()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  background: 'linear-gradient(135deg, var(--success), var(--success-light))'
                }}
              >
                <FaCheckCircle /> Finish Drying
              </Button>
            )}
          </div>
          {!canAct() && bag.assignedStaffId && (
            <div className="small-muted" style={{ marginTop: 12, padding: 12, background: 'var(--glass)', borderRadius: 'var(--radius)' }}>
              This bag is assigned to {bag.assignedStaffId}. Only the assigned staff can perform actions.
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Audit Log</h3>
          <AuditTimeline entries={bag.audit || []} />
        </div>
      </div>

      {/* Count Modal */}
      <Modal 
        open={countModal.open} 
        onClose={() => setCountModal({ open: false, stage: null, count: '' })}
      >
        <h3 style={{ marginTop: 0 }}>Enter Clothes Count</h3>
        <p className="small-muted" style={{ marginBottom: 16 }}>
          Enter the number of clothes for {countModal.stage} stage
        </p>
        <Input
          label="Clothes Count"
          type="number"
          value={countModal.count}
          onChange={e => setCountModal({ ...countModal, count: e.target.value })}
          min="0"
          autoFocus
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Button onClick={handleStageUpdate} style={{ flex: 1 }}>
            Confirm
          </Button>
          <Button 
            className="ghost" 
            onClick={() => setCountModal({ open: false, stage: null, count: '' })}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
