"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function HomePage() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("date")
        .order("date", { ascending: false })
      if (error) return console.error(error)

      if (!data || data.length === 0) {
        setStreak(0)
        return
      }

      // Calculate consecutive streak
      let count = 0
      let today = new Date()
      for (let log of data) {
        const logDate = new Date(log.date)
        const diffDays = Math.floor(
          (today - logDate) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 0 || diffDays === 1) {
          count += 1
          today = logDate
        } else break
      }
      setStreak(count)
    }

    fetchStreak()
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Mobility Tracker</h1>

      <p>
        🔥 Current streak: <strong>{streak} day{streak !== 1 ? "s" : ""}</strong>
      </p>

      <p>Quick links:</p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>
          <Link href="/login">
            <button style={{ margin: 5, padding: "8px 16px" }}>Login</button>
          </Link>
        </li>
        <li>
          <Link href="/today">
            <button style={{ margin: 5, padding: "8px 16px" }}>Mark Today Done</button>
          </Link>
        </li>
        <li>
          <Link href="/history">
            <button style={{ margin: 5, padding: "8px 16px" }}>History</button>
          </Link>
        </li>
      </ul>
    </div>
  )
}
