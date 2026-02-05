"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { getDummyLogs } from "../../lib/mockData"

export default function HistoryPage() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({ streak: 0, totalDone: 0 })

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from("daily_logs")
          .select("*")
          .order("date", { ascending: false })
        if (error) throw error
        setLogs(data)
      } catch (e) {
        // fallback to mock data
        setLogs(getDummyLogs())
      }
    }
    fetchLogs()
  }, [])

  useEffect(() => {
    if (!logs || logs.length === 0) return
    let streak = 0
    let today = new Date()
    let total = 0
    for (let log of logs) {
      if (log.mobility_done) total += 1
      const diffDays = Math.floor((today - new Date(log.date)) / (1000 * 60 * 60 * 24))
      if (diffDays === 0 || diffDays === 1) {
        if (log.mobility_done) streak += 1
        today = new Date(log.date)
      } else break
    }
    setStats({ streak, totalDone: total })
  }, [logs])

  const last14 = logs.slice(0, 14).reverse()

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ margin: "0 0 24px 0", fontSize: 32, fontWeight: 700 }}>Your History</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Current Streak</h3>
          </div>
          <p style={{ margin: 0, fontSize: 40, fontWeight: 700, color: "var(--accent-light)" }}>{stats.streak}</p>
          <p className="muted" style={{ margin: "8px 0 0 0" }}>consecutive days</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Total Completed</h3>
          </div>
          <p style={{ margin: 0, fontSize: 40, fontWeight: 700, color: "var(--success)" }}>{stats.totalDone}</p>
          <p className="muted" style={{ margin: "8px 0 0 0" }}>days completed</p>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 16 }}>Last 14 Days Activity</h3>
        <div style={{ display: "flex", gap: 10, alignItems: "end", height: 120, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
          {last14.map((log) => (
            <div key={log.id} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ height: log.mobility_done ? 80 : 12, width: "100%", maxWidth: 24, background: log.mobility_done ? "linear-gradient(135deg, var(--accent), var(--accent-light))" : "rgba(255,255,255,0.08)", borderRadius: 6, margin: "0 auto", transition: "all 0.2s" }} />
              <div style={{ fontSize: 11, marginTop: 8, color: "var(--muted)" }}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(log.date + 'T00:00:00Z').getUTCDay()]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: 16 }}>All Logs</h3>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {logs.map((log, idx) => (
            <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: idx < logs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 14 }}>
              <span>{log.date}</span>
              <span style={{ fontWeight: 600 }}>{log.mobility_done ? "✅" : log.partial ? "⚡" : "❌"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

