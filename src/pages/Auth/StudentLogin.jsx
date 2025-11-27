import React from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { initDefaults, getItem, setItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import { FaGraduationCap } from 'react-icons/fa'

export default function StudentLogin() {
  const nav = useNavigate()
  const toast = useToast()
  const [roll, setRoll] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => { 
    initDefaults() 
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    
    if (!roll.trim()) {
      toast.error('Please enter roll number')
      return
    }

    setLoading(true)
    
    try {
      const students = getItem(STORAGE_KEYS.STUDENTS) || []
      const found = students.find(s => s.roll === roll.trim())
      
      if (!found) {
        const newStudent = { 
          roll: roll.trim(), 
          name: '', 
          contact: '', 
          hostelBlock: '', 
          room: '', 
          batch: roll.trim().slice(0,2) || '', 
          firstLogin: true 
        }
        students.push(newStudent)
        setItem(STORAGE_KEYS.STUDENTS, students)
        setItem(SESSION_KEY, { role: 'student', id: newStudent.roll, name: newStudent.name || '' })
        toast.success('Welcome! Please complete your profile.')
        nav('/student/profile-setup', { state: { roll: newStudent.roll } })
        return
      }
      
      // Existing student
      setItem(SESSION_KEY, { role: 'student', id: found.roll, name: found.name || '' })
      toast.success(`Welcome back, ${found.name || found.roll}!`)
      nav('/student/dashboard')
    } catch (err) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: 40, maxWidth: 480 }}>
      <div className="sd-card sd-card--light">
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: 8
          }}>
            <FaGraduationCap size={40} color="#fff" />
          </div>
          <h2 style={{ margin: 0 }}>Student Login</h2>
          <p className="small-muted" style={{ margin: 0 }}>
            Enter your roll number to continue
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <Input 
            label="Roll Number" 
            value={roll} 
            onChange={e => setRoll(e.target.value)}
            placeholder="Enter your roll number"
            required
            autoFocus
          />
          <Input 
            label="Password (optional for demo)" 
            value={pass} 
            type="password" 
            onChange={e => setPass(e.target.value)}
            placeholder="Password"
          />
          <Button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            className="sd-btn ghost"
            onClick={() => nav('/')}
            style={{ fontSize: 14 }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
