import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { getItem, setItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import { FaUser } from 'react-icons/fa'

export default function ProfileSetup() {
  const nav = useNavigate()
  const toast = useToast()
  const loc = useLocation()
  const initialRoll = (loc.state && loc.state.roll) || ''

  const [form, setForm] = React.useState({
    name: '',
    roll: initialRoll,
    contact: '',
    hostelBlock: '',
    room: '',
    batch: initialRoll.slice(0,2) || ''
  })

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const session = getItem(SESSION_KEY)
    if (!session || session.role !== 'student') {
      nav('/')
      return
    }

    if(!initialRoll) {
      const students = getItem(STORAGE_KEYS.STUDENTS) || []
      if(students[0]) {
        setForm(s => ({
          ...s, 
          roll: students[0].roll, 
          batch: (students[0].roll || '').slice(0,2)
        }))
      }
    }
  }, [initialRoll, nav])

  function update(k, v) { 
    setForm(s => ({ ...s, [k]: v })) 
  }

  function onSave(e) {
    e.preventDefault()
    
    if(!form.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if(!form.contact.trim()) {
      toast.error('Please enter your contact number')
      return
    }
    if(!form.hostelBlock.trim()) {
      toast.error('Please enter your hostel block')
      return
    }
    if(!form.room.trim()) {
      toast.error('Please enter your room number')
      return
    }

    setLoading(true)
    
    try {
      const students = getItem(STORAGE_KEYS.STUDENTS) || []
      const idx = students.findIndex(s => s.roll === form.roll)
      const payload = { ...form, firstLogin: false }
      
      if(idx === -1) {
        students.push(payload)
      } else {
        students[idx] = { ...students[idx], ...payload }
      }
      
      setItem(STORAGE_KEYS.STUDENTS, students)
      
      // Update session
      const session = getItem(SESSION_KEY)
      if (session) {
        setItem(SESSION_KEY, { ...session, name: form.name })
      }
      
      toast.success('Profile saved successfully!')
      setTimeout(() => {
        nav('/student/dashboard')
      }, 500)
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
    }
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
            <FaUser size={24} color="#fff" />
          </div>
          <h2 style={{ margin: 0 }}>Profile Setup</h2>
        </div>

        <form onSubmit={onSave}>
          <Input 
            label="Name" 
            value={form.name} 
            onChange={e => update('name', e.target.value)}
            required
            placeholder="Enter your full name"
          />
          <Input 
            label="Roll Number" 
            value={form.roll} 
            readOnly
            style={{ opacity: 0.7 }}
          />
          <Input 
            label="Contact Number" 
            value={form.contact} 
            onChange={e => update('contact', e.target.value)}
            type="tel"
            required
            placeholder="Enter your contact number"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Input 
              label="Hostel Block" 
              value={form.hostelBlock} 
              onChange={e => update('hostelBlock', e.target.value.toUpperCase())}
              required
              placeholder="e.g., A, B, C"
            />
            <Input 
              label="Room Number" 
              value={form.room} 
              onChange={e => update('room', e.target.value)}
              required
              placeholder="e.g., 101, 205"
            />
          </div>
          <Input 
            label="Batch" 
            value={form.batch} 
            onChange={e => update('batch', e.target.value)}
            placeholder="e.g., 20, 21, 22"
          />
          <Button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </div>
  )
}
