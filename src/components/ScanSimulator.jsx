import React from 'react'
import Modal from './Modal'

export default function ScanSimulator({ open, onClose, onScan }) {
  function gen() {
    const id = `BAG-${Math.random().toString(36).slice(2,9).toUpperCase()}`
    onScan(id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h3>Scan Simulator</h3>
      <p>Simulates camera scan. Generate an ID or enter manually.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="sd-btn" onClick={gen}>Generate Bag ID</button>
        <button
          className="sd-btn"
          onClick={() => {
            const manual = prompt('Enter Bag ID:')
            if (manual) { onScan(manual.trim()); onClose() }
          }}
        >
          Manual
        </button>
      </div>
    </Modal>
  )
}
