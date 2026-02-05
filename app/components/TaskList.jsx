"use client"

import React from "react"
import { supabase } from "../../lib/supabaseClient"

export default function TaskList({ title = "Today", tasks = [], editable = true, onChange, compact = false, ownerName }) {
  const [expanded, setExpanded] = React.useState(() => tasks.map((t) => t.id))

  React.useEffect(() => {
    // reset expanded when tasks change
    setExpanded(tasks.map((t) => t.id))
  }, [tasks])

  const updateStatus = (id, status) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, status } : t))
    onChange && onChange(next)
    // record event asynchronously
    ;(async () => {
      try {
        const session = await supabase.auth.getSession()
        const userId = session?.data?.session?.user?.id
        const today = new Date().toISOString().slice(0,10)
        const prev = tasks.find((t)=>t.id===id)?.status || 'pending'
        const event = { taskId: id, prevStatus: prev, newStatus: status, ts: new Date().toISOString(), user_id: userId }
        await fetch('/api/events', { method: 'POST', body: JSON.stringify({ user_id: userId, date: today, event, tasks: next }), headers: { 'Content-Type': 'application/json' } })
      } catch (e) {
        console.error('record event failed', e)
      }
    })()
  }
  const updateNote = (id, note) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, note } : t))
    onChange && onChange(next)
  }

  const toggle = (id) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div style={{ minWidth: 280 }}>
      <div style={{ marginBottom: 14 }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h4>
        {ownerName && <p className="muted" style={{ margin: "4px 0 0 0" }}>Friend</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.map((t) => (
          <div key={t.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => toggle(t.id)}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>{t.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{t.target || ""}</div>
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button 
                  className={t.status === 'done' ? 'btn btn-accent' : 'btn'}
                  onClick={() => editable && updateStatus(t.id, t.status === 'done' ? 'pending' : 'done')}
                  style={{ width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
                >
                  ✅
                </button>
                <button 
                  className={t.status === 'partial' ? 'btn btn-accent' : 'btn'}
                  onClick={() => editable && updateStatus(t.id, t.status === 'partial' ? 'pending' : 'partial')}
                  style={{ width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
                >
                  ⚡
                </button>
                <button 
                  className={t.status === 'missed' ? 'btn btn-accent' : 'btn'}
                  onClick={() => editable && updateStatus(t.id, t.status === 'missed' ? 'pending' : 'missed')}
                  style={{ width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
                >
                  ❌
                </button>
              </div>
            </div>

            {expanded.includes(t.id) && (
              <div style={{ marginTop: 10 }}>
                <input placeholder="Add notes..." value={t.note || ''} onChange={(e) => editable && updateNote(t.id, e.target.value)} style={{ width: "100%" }} />
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
