import React from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { initDefaults, getItem, setItem, STORAGE_KEYS, SESSION_KEY } from '../../services/storage'
import { useToast } from '../../components/Toast'
import { FaUserShield } from 'react-icons/fa'

export default function AdminLogin() {
  const nav = useNavigate()
  const toast = useToast()
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    initDefaults()
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    
    if (!user.trim()) {
      toast.error('Please enter username')
      return
    }

    setLoading(true)
    
    try {
      const admins = getItem(STORAGE_KEYS.ADMINS) || []
      const found = admins.find(a => a.username === user.trim())
      
      // For demo, accept any username, but check password if admin exists
      if (found && found.password && pass !== found.password) {
        toast.error('Invalid password')
        setLoading(false)
        return
      }
      
      setItem(SESSION_KEY, { 
        role: 'admin', 
        id: found?.username || user || 'admin', 
        name: found?.displayName || user || 'Admin' 
      })
      
      toast.success(`Welcome, ${found?.displayName || user || 'Admin'}!`)
      nav('/admin/dashboard')
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
            <FaUserShield size={40} color="#fff" />
          </div>
          <h2 style={{ margin: 0 }}>Admin Login</h2>
          <p className="small-muted" style={{ margin: 0 }}>
            Enter your credentials to access admin dashboard
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <Input 
            label="Username" 
            value={user} 
            onChange={e => setUser(e.target.value)}
            placeholder="Enter username (default: admin)"
            required
            autoFocus
          />
          <Input 
            label="Password" 
            value={pass} 
            type="password" 
            onChange={e => setPass(e.target.value)}
            placeholder="Enter password (default: admin123)"
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
