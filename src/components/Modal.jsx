import React from 'react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="sd-modal-backdrop" onClick={onClose}>
      <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sd-modal-close" onClick={onClose}>✕</button>
        <div className="sd-modal-content">{children}</div>
      </div>
    </div>
  )
}
