"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { getDummyLogs, getDummyTodayTasks, MOCK_USER_ID, MOCK_FRIEND_ID, GOALS } from "../lib/mockData"
import TaskList from "./components/TaskList"

function sevenDaysAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 6)
  return d.toISOString().slice(0, 10)
}

function formatShort(dateStr) {
  // deterministic short weekday using UTC to avoid locale/timezone mismatches
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  // ensure dateStr parsed as UTC date (YYYY-MM-DD)
  const d = new Date(dateStr + "T00:00:00Z")
  return names[d.getUTCDay()]
}

export default function HomePage() {
  const [userStreak, setUserStreak] = useState(0)
  const [friendStreak, setFriendStreak] = useState(null)
  const [miniLogs, setMiniLogs] = useState({ user: [], friend: [] })
  const [message, setMessage] = useState("")
  const [todayTasksFor, setTodayTasksFor] = useState({ user: [], friends: [] })
  const [todayKey, setTodayKey] = useState(null)

  useEffect(() => {
    const load = async () => {
      // attempt to read session; fall back to mock user if Supabase/auth isn't available
      let userId = null
      try {
        const sessionRes = await supabase.auth.getSession()
        userId = sessionRes?.data?.session?.user?.id || null
      } catch (e) {
        // ignore - fall back to mock below
      }

      // fetch last 30 logs (all users) to compute streaks
      let data = null
      try {
        const res = await supabase
          .from("daily_logs")
          .select("id,user_id,date,mobility_done,partial,notes")
          .order("date", { ascending: false })
        if (res.error) throw res.error
        data = res.data
      } catch (err) {
        // fallback to mock data
        data = getDummyLogs()
        if (!userId) userId = MOCK_USER_ID
      }

      // helper to calc streak for a userId
      const calcStreak = (logs, uid) => {
        const userLogs = logs.filter((l) => (uid ? l.user_id === uid : l.user_id))
        if (!userLogs.length) return 0
        let count = 0
        let today = new Date()
        for (let log of userLogs) {
          const logDate = new Date(log.date)
          const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24))
          if (diffDays === 0 || diffDays === 1) {
            if (log.mobility_done) count += 1
            today = logDate
          } else break
        }
        return count
      }

      const uStreak = calcStreak(data, userId)
      setUserStreak(uStreak)

      // pick a single friend from recent logs to show side-by-side
      const friendIds = [...new Set(data.map((d) => d.user_id).filter((id) => id && id !== userId))]
      const friendId = friendIds.length > 0 ? friendIds[0] : null
      if (friendId) {
        const fStreak = calcStreak(data, friendId)
        setFriendStreak({ id: friendId, streak: fStreak })
      }

      // mini calendar: last 7 days per user and friend
      const start = sevenDaysAgo()
      let mini = null
      try {
        const res = await supabase
          .from("daily_logs")
          .select("user_id,date,mobility_done,partial")
          .gte("date", start)
          .order("date", { ascending: true })
        if (res.error) throw res.error
        mini = res.data
      } catch (e) {
        const all = getDummyLogs()
        mini = all.filter((l) => l.date >= start).sort((a,b)=>a.date.localeCompare(b.date))
      }

      const userMini = mini.filter((l) => l.user_id === userId)
      const friendMini = mini.filter((l) => l.user_id && l.user_id !== userId)
      setMiniLogs({ user: userMini, friend: friendMini })

      // prepare today tasks for modal: fetch today's tasks for user and one friend
      const todayKey = new Date().toISOString().slice(0, 10)
      let tasksByUser = {}
      try {
        const res = await supabase.from("daily_logs").select("user_id,tasks").eq("date", todayKey)
        if (res.error) throw res.error
        ;(res.data || []).forEach((r) => { tasksByUser[r.user_id] = r.tasks })
      } catch (e) {
        tasksByUser[MOCK_USER_ID] = getDummyTodayTasks(MOCK_USER_ID)
        tasksByUser[MOCK_FRIEND_ID] = getDummyTodayTasks(MOCK_FRIEND_ID)
        if (!userId) userId = MOCK_USER_ID
      }

      const userTasks = tasksByUser[userId] || getDummyTodayTasks(userId || MOCK_USER_ID)
      const friend = friendId ? { id: friendId, name: `Friend`, tasks: tasksByUser[friendId] || getDummyTodayTasks(friendId) } : null
      setTodayTasksFor({ user: userTasks, friends: friend ? [friend] : [] })
      // expose today's date for title
      setTodayKey(new Date().toISOString().slice(0,10))

      // motivational message
      if (uStreak >= 7) setMessage("🔥 You\'re on a roll! Keep it up.")
      else if (uStreak >= 3) setMessage("✨ Nice streak building!")
      else setMessage("Let\'s build a habit together.")
    }
    load()
  }, [])

  const utcDateKey = (offsetDays) => {
    const now = new Date()
    const y = now.getUTCFullYear()
    const m = now.getUTCMonth()
    const d = now.getUTCDate()
    const dt = new Date(Date.UTC(y, m, d + offsetDays))
    return dt.toISOString().slice(0, 10)
  }

  const renderMini = (logs) => {
    // build map day->status using UTC-based keys for determinism
    const days = []
    for (let i = -6; i <= 0; i++) {
      const key = utcDateKey(i)
      const found = logs.find((l) => l.date && l.date.slice(0, 10) === key)
      let symbol = "❌"
      if (found) symbol = found.mobility_done ? "✅" : found.partial ? "⚡" : "⚠️"
      days.push({ key, symbol })
    }
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {days.map((d) => (
          <div key={d.key} title={d.key} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12 }}>{formatShort(d.key)}</div>
            <div style={{ fontSize: 20 }}>{d.symbol}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Welcome back 👋</h1>
            <p className="muted" style={{ margin: 0 }}>{message}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 8 }}>Your Progress {userStreak >= 3 ? "🔥" : ""}</h3>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--accent-light)" }}>{userStreak} day{userStreak !== 1 ? "s" : ""} streak</p>
          </div>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
            {renderMini(miniLogs.user)}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 12px 0" }}>Friend</h3>
          {friendStreak ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--accent-light)" }}>{friendStreak.streak}</p>
                <p className="muted" style={{ margin: "4px 0 0 0", fontSize: 12 }}>day streak</p>
              </div>
              <div style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 10, fontSize: 12 }}>
                {renderMini(miniLogs.friend)}
              </div>
              {friendStreak.streak === 0 && <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "var(--muted)" }}>🟠 Send them a nudge!</p>}
            </>
          ) : (
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>Invite a friend to get started</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "32px 0 20px 0", fontSize: 24, fontWeight: 700 }}>Today: {todayKey}</h2>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <TaskList title="Log your progress" tasks={todayTasksFor.user} onChange={(t)=>setTodayTasksFor(prev=>({...prev, user:t}))} ownerName={null} />
            <button className="btn btn-accent" onClick={async ()=>{
              const todayKey = new Date().toISOString().slice(0,10)
              try {
                const session = await supabase.auth.getSession()
                const uid = session?.data?.session?.user?.id
                if (!uid) { alert('Not signed in'); return }
                const { error } = await supabase.from('daily_logs').upsert({ user_id: uid, date: todayKey, tasks: todayTasksFor.user, mobility_done: todayTasksFor.user.some(t=>t.status==='done'), partial: todayTasksFor.user.some(t=>t.status==='partial') }, { onConflict: ['user_id','date'] })
                if (error) alert(error.message)
                else alert('Progress saved! 🎉')
              } catch(e) {
                alert('Saved locally (no Supabase)')
              }
            }} style={{ marginTop: 12 }}>Save Progress</button>
          </div>
          {todayTasksFor.friends && todayTasksFor.friends.length > 0 && (
            <div style={{ width: 300 }}>
              {todayTasksFor.friends.map((f)=> (
                <TaskList key={f.id} title={f.name} tasks={f.tasks} editable={false} ownerName={f.name} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700 }}>Your Goals</h3>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {GOALS.map((goal) => (
              <div key={goal.id} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{goal.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{goal.label}</div>
                <div className="muted" style={{ fontSize: 12 }}>{goal.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
