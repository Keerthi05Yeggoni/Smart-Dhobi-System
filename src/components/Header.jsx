import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaTshirt } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { getItem, setItem, STORAGE_KEYS, SESSION_KEY } from '../services/storage'

export default function Header() {
  const nav = useNavigate()
  const location = useLocation()
  const [session, setSession] = React.useState(getItem(SESSION_KEY))

  React.useEffect(() => {
    const handler = () => setSession(getItem(SESSION_KEY))
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // Update session on route change
  React.useEffect(() => {
    setSession(getItem(SESSION_KEY))
  }, [location.pathname])

  function logout() {
    setItem(SESSION_KEY, null)
    setSession(null)
    nav('/')
  }

  function handleRoleClick(role) {
    nav(`/login/${role}`)
  }

  return (
    <header className="sd-header">
      <div className="sd-brand">
        <div className="sd-logo">
          <FaTshirt size={20} color="#fff" />
        </div>
        <div className="sd-title">LaundryHub</div>
      </div>

      <div style={{ marginLeft: 16, fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>
        Smart Laundry Management System
      </div>

      <div className="sd-role">
        {session ? (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
              marginRight: 12
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)'
              }}>
                {session.name || session.id || session.role}
              </div>
              <div className="small-muted" style={{ fontSize: 12 }}>
                {session.role?.toUpperCase()}
                {session.role === 'student' && session.id && ` • ${session.id}`}
              </div>
            </div>
            <button
              className="sd-btn ghost"
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px'
              }}
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="header-role-btn"
              onClick={() => handleRoleClick('student')}
            >
              <span>Student</span>
            </button>
            <button
              className="header-role-btn"
              onClick={() => handleRoleClick('staff')}
            >
              <span>Staff</span>
            </button>
            <button
              className="header-role-btn"
              onClick={() => handleRoleClick('admin')}
            >
              <span>Admin</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
