import React from 'react'
import { useParams } from 'react-router-dom'
import { getBagById } from '../../services/bagService'
import AuditTimeline from '../../components/AuditTimeline'

export default function AdminBagView(){
  const { bagId } = useParams()
  const [bag, setBag] = React.useState(null)
  React.useEffect(()=>{ setBag(getBagById(bagId)) },[bagId])
  if(!bag) return <div style={{maxWidth:640, margin:'24px auto'}} className="sd-card">Bag not found</div>
  return (
    <div style={{maxWidth:720, margin:'24px auto'}} className="sd-card">
      <div className="sd-card sd-card--light">
      <h3>Admin View — {bag.bagId}</h3>

      <div style={{marginTop:12}}>
        <div><strong>Student</strong>: {bag.studentName} ({bag.studentRoll})</div>
        <div><strong>Dropoff</strong>: {new Date(bag.dropoffTimestamp).toLocaleString()}</div>
        <div><strong>Estimated Pickup</strong>: {bag.estimatedPickupDate}</div>
        <div><strong>Status</strong>: {bag.status}</div>
      </div>

      <div style={{marginTop:18}}>
        <h4>Audit Log</h4>
        <AuditTimeline entries={bag.audit || []} />
      </div>
    </div>
    </div>
  )
}
