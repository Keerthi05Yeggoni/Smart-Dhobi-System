import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGraduationCap, FaUserTie, FaUserShield } from 'react-icons/fa'
import Button from '../../components/Button'

export default function LoginChoice() {
  const nav = useNavigate()
  
  const roleOptions = [
    {
      role: 'student',
      label: 'Student Login',
      icon: FaGraduationCap,
      description: 'Track your laundry and manage dropoffs',
      path: '/login/student'
    },
    {
      role: 'staff',
      label: 'Staff Login',
      icon: FaUserTie,
      description: 'Process and manage laundry operations',
      path: '/login/staff'
    },
    {
      role: 'admin',
      label: 'Admin Login',
      icon: FaUserShield,
      description: 'Monitor system and view analytics',
      path: '/login/admin'
    }
  ]

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-start' }}>
      <div className="hero-card" style={{ width: '100%', maxWidth: '100%', padding: '64px 56px', margin: 0 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, textAlign: 'center', fontWeight: 700, fontSize: '42px' }}>
          Welcome to <span className="gradient-text">LaundryHub</span>
        </h2>
        <p className="small-muted" style={{ fontSize: 18, marginBottom: 48, textAlign: 'center', fontWeight: 400 }}>
          Streamlined laundry management for modern campuses
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: 48,
          marginTop: 48,
          flexWrap: 'nowrap',
          width: '100%',
          padding: 0
        }}>
          {roleOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.role}
                onClick={() => nav(option.path)}
                className="sd-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  padding: '40px 32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '1.5px solid var(--glass-border)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                  transition: 'all var(--transition-base)',
                  flex: '1 1 0',
                  minWidth: 0,
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow-strong)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--glass-border)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow)',
                  marginBottom: 16
                }}>
                  <Icon size={36} color="#fff" />
                </div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 10
                }}>
                  {option.label}
                </div>
                <div style={{
                  fontSize: 15,
                  color: 'var(--muted)',
                  lineHeight: 1.6
                }}>
                  {option.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
