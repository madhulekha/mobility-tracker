"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function HistoryPage() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .order("date", { ascending: false })
      if (error) alert(error.message)
      else setLogs(data)
    }
    fetchLogs()
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h2>History (last logs)</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.date}: {log.mobility_done ? "✅ Done" : "❌ Not done"}
          </li>
        ))}
      </ul>
    </div>
  )
}
