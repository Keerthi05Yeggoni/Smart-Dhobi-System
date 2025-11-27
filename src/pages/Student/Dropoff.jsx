import React from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import ScanSimulator from '../../components/ScanSimulator'
import { genBagId } from '../../utils/idGen'
import { createBag } from '../../services/bagService'
import { getItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { useNavigate } from 'react-router-dom'
import Countdown from '../../components/Countdown'
import { useToast } from '../../components/Toast'
import { FaQrcode, FaTshirt } from 'react-icons/fa'

export default function Dropoff(){
  const nav = useNavigate()
  const toast = useToast()
  const [bagId, setBagId] = React.useState('')
  const [count, setCount] = React.useState(1)
  const [scanOpen, setScanOpen] = React.useState(false)
  const [confirmDate, setConfirmDate] = React.useState(null)
  const [showCountdown, setShowCountdown] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'student') {
      nav('/')
      return
    }
  }, [nav])

  function onScan(id){ 
    if(!id) return
    setBagId(id)
    toast.success('Bag ID scanned successfully!')
  }

  function validate(){
    if(!bagId.trim()) {
      toast.error('Please enter or scan Bag ID')
      return false
    }
    const bags = getItem(STORAGE_KEYS.BAGS) || []
    if(bags.some(b=>b.bagId === bagId.trim())) {
      toast.error('Bag ID already exists')
      return false
    }
    const n = Number(count)
    if(!n || n < 1 || !Number.isInteger(n)) {
      toast.error('Clothes count must be a positive integer')
      return false
    }
    return true
  }

  function onSubmit(e){
    e.preventDefault()
    if(!validate()) return
    
    setLoading(true)
    const students = getItem(STORAGE_KEYS.STUDENTS) || []
    const session = getItem(SESSION_KEY)
    const student = students.find(s => s.roll === session?.id) || { 
      roll: session?.id || '0000', 
      name: 'Demo', 
      hostelBlock: 'A', 
      room: '101', 
      contact: '000' 
    }
    
    const now = new Date().toISOString()
    const est = new Date(Date.now() + 5*24*60*60*1000).toISOString().slice(0,10)
    
    const bag = {
      id: genBagId(),
      bagId: bagId.trim() || genBagId(),
      studentRoll: student.roll,
      studentName: student.name,
      hostelBlock: student.hostelBlock,
      room: student.room,
      contact: student.contact,
      dropoffTimestamp: now,
      estimatedPickupDate: est,
      status: 'Dropped',
      declaredCount: Number(count),
      countHistory: [{ stage:'Dropped', count: Number(count), timestamp: now }],
      assignedStaffId: null,
      pickupTimestamp: null,
      audit: []
    }
    
    try {
      createBag(bag)
      toast.success('Laundry bag submitted successfully!')
      setConfirmDate(est)
      setShowCountdown(true)
    } catch(err) {
      toast.error(err.message || 'Failed to submit bag')
    } finally {
      setLoading(false)
    }
  }

  function onCountdownFinish(){
    setShowCountdown(false)
    setConfirmDate(null)
    nav('/student/dashboard')
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="sd-card sd-card--light">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
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
            <FaTshirt size={24} color="#fff" />
          </div>
          <h2 style={{ margin: 0 }}>Dropoff Laundry</h2>
        </div>

        {!confirmDate ? (
          <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
              <Button 
                type="button" 
                onClick={()=>setScanOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
              >
                <FaQrcode /> Scan Bag ID
              </Button>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Input 
                  label="Bag ID (manual entry)" 
                  value={bagId} 
                  onChange={e=>setBagId(e.target.value)}
                  placeholder="Enter or scan bag ID"
                />
              </div>
            </div>
            
            <Input 
              label="Number of Clothes" 
              type="number" 
              value={count} 
              onChange={e=>setCount(e.target.value)}
              min="1"
              required
            />
            
            <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Submitting...' : 'Submit Dropoff'}
            </Button>
          </form>
        ) : (
          <div className="sd-card" style={{ 
            background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.1), rgba(86, 211, 100, 0.05))',
            borderColor: 'var(--success)',
            textAlign: 'center',
            padding: 32
          }}>
            <div style={{ 
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--success), var(--success-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 24px rgba(63, 185, 80, 0.3)'
            }}>
              <FaTshirt size={32} color="#fff" />
            </div>
            <h3 style={{ marginBottom: 8, color: 'var(--success)' }}>Bag Accepted!</h3>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Estimated Pickup Date: {confirmDate}
            </div>
            <div className="small-muted" style={{ marginBottom: 16 }}>
              Your laundry bag has been registered. You'll be redirected to your dashboard.
            </div>
            {showCountdown && (
              <div style={{ marginTop: 16 }}>
                <Countdown seconds={5} onFinish={onCountdownFinish} />
              </div>
            )}
          </div>
        )}

        <ScanSimulator open={scanOpen} onClose={()=>setScanOpen(false)} onScan={onScan} />
      </div>
    </div>
  )
}
