import React from 'react'

export default function Button({ children, onClick, className = '', type = 'button' }) {
  return (
    <button type={type} className={`sd-btn ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
