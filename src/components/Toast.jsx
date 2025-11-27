import React from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

const ToastContext = React.createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const showToast = React.useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = React.useCallback((message, duration) => showToast(message, 'success', duration), [showToast])
  const error = React.useCallback((message, duration) => showToast(message, 'error', duration), [showToast])
  const info = React.useCallback((message, duration) => showToast(message, 'info', duration), [showToast])
  const warning = React.useCallback((message, duration) => showToast(message, 'warning', duration), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    warning: <FiAlertCircle size={20} />,
    info: <FiInfo size={20} />
  }

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--info)'
  }

  return (
    <div 
      className="toast-item"
      style={{
        '--toast-color': colors[toast.type]
      }}
    >
      <div className="toast-icon" style={{ color: colors[toast.type] }}>
        {icons[toast.type]}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onClose}>
        <FiX size={16} />
      </button>
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

