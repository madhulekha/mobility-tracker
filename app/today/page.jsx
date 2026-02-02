"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function TodayPage() {
  const [log, setLog] = useState(null)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const fetchToday = async () => {
      const { data } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("date", today)
        .single()
      setLog(data)
    }
    fetchToday()
  }, [])

  const markDone = async () => {
    if (log) return alert("Already logged today ✅")
    const { data, error } = await supabase.from("daily_logs").insert([
      {
        date: today,
        mobility_done: true,
      },
    ])
    if (error) alert(error.message)
    else setLog(data[0])
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Today: {today}</h2>
      {log ? (
        <p>✅ Already done!</p>
      ) : (
        <button onClick={markDone}>Mark 20 min mobility done ✅</button>
      )}
    </div>
  )
}
