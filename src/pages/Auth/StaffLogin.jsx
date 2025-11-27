import React from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { initDefaults, getItem, setItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import { FaUserTie } from 'react-icons/fa'

export default function StaffLogin() {
  const nav = useNavigate()
  const toast = useToast()
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    initDefaults()
    const s = getItem(STORAGE_KEYS.STAFF) || []
    if(!s.length) {
      setItem(STORAGE_KEYS.STAFF, [{ 
        id: 'staff-1', 
        username: 'staff1', 
        displayName: 'Staff One', 
        active: true 
      }])
    }
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    
    if (!user.trim()) {
      toast.error('Please enter username')
      return
    }

    setLoading(true)
    
    try {
      const staffs = getItem(STORAGE_KEYS.STAFF) || []
      const found = staffs.find(s => s.username === user.trim())
      
      setItem(SESSION_KEY, { 
        role: 'staff', 
        id: found?.id || user || 'staff-1', 
        name: found?.displayName || user || 'Staff One' 
      })
      
      toast.success(`Welcome, ${found?.displayName || user}!`)
      nav('/staff/dashboard')
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
            <FaUserTie size={40} color="#fff" />
          </div>
          <h2 style={{ margin: 0 }}>Staff Login</h2>
          <p className="small-muted" style={{ margin: 0 }}>
            Enter your credentials to access staff dashboard
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <Input 
            label="Username" 
            value={user} 
            onChange={e => setUser(e.target.value)}
            placeholder="Enter username"
            required
            autoFocus
          />
          <Input 
            label="Password" 
            value={pass} 
            type="password" 
            onChange={e => setPass(e.target.value)}
            placeholder="Enter password"
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
