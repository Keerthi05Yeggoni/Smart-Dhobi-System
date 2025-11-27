import React from 'react'

export default function Input({ label, className = '', ...props }) {
  return (
    <label className={`sd-field ${className}`}>
      {label && <div className="sd-label">{label}</div>}
      <input className="sd-input" {...props} />
    </label>
  )
}
