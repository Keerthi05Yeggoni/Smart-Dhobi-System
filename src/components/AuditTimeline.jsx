import React from 'react'

export default function AuditTimeline({ entries = [] }) {
  if (!entries || entries.length === 0) return <div className="small-muted">No audit entries.</div>
  return (
    <div className="audit-list">
      {entries.map((e, i) => (
        <div key={i} className="audit-item">
          <div className="audit-time">{new Date(e.timestamp).toLocaleString()}</div>
          <div>
            <div style={{fontWeight:700}}>{e.action} {e.by ? `• ${e.by}` : ''}</div>
            {e.details && <div className="small-muted" style={{marginTop:6}}>{e.details}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
