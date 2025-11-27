import React from 'react'

export default function Countdown({ seconds = 5, onFinish }) {
  const [s, setS] = React.useState(seconds)
  React.useEffect(()=>{
    setS(seconds)
    const t = setInterval(()=>{
      setS(prev => {
        if (prev <= 1) {
          clearInterval(t)
          onFinish && onFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return ()=> clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[seconds])

  const pct = Math.max(0, Math.round((s / seconds) * 100))

  return (
    <div className="countdown-wrap">
      <div className="countdown-circle">{s}</div>
      <div>
        <div style={{fontSize:14,fontWeight:600}}>Redirecting in {s} second{s===1?'':'s'}</div>
        <div className="small-muted" style={{width:160,height:6,background:'rgba(255,255,255,0.03)',borderRadius:6,overflow:'hidden',marginTop:6}}>
          <div style={{height:6,width:`${pct}%`,background:'linear-gradient(90deg,var(--accent),var(--accent-2))',borderRadius:6,transition:'width 0.4s ease'}}/>
        </div>
      </div>
    </div>
  )
}
