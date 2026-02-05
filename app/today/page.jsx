"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TodayPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/")
  }, [])

  return null
}

/*
export default function TodayPageOld() {
  const [log, setLog] = useState(null)
  const today = new Date().toISOString().slice(0, 10)

  const defaultTasks = [
    { id: "t1", title: "20 min mobility", target: "20 min", status: "pending", note: "" },
    { id: "c1", title: "Side lunge challenge", target: "30s hold", status: "pending", note: "" },
  ]

  const [tasks, setTasks] = useState(defaultTasks)

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const { data } = await supabase
          .from("daily_logs")
          .select("*")
          .eq("date", today)
          .single()
        if (data) {
          setLog(data)
          if (data.tasks) setTasks(data.tasks)
          return
        }
      } catch (e) {
        // fall back to mock tasks
      }

      // mock fallback
      setTasks(getDummyTodayTasks(MOCK_USER_ID))
    }
    fetchToday()
  }, [])

  const saveLog = async () => {
    if (log) return alert("Already logged today ✅")
    const mobility_done = tasks.some((t) => t.status === "done")
    const partial = tasks.some((t) => t.status === "partial")
    try {
      const { data, error } = await supabase.from("daily_logs").insert([
        {
          date: today,
          mobility_done,
          partial,
          tasks,
        },
      ])
      if (error) throw error
      else setLog(data[0])
    } catch (e) {
      // local/mock save
      setLog({ date: today, tasks, mobility_done, partial })
      alert('Saved locally (mock)')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Today: {today}</h2>

      {log ? (
        <div>
          <p>✅ Logged</p>
          <pre style={{ background: "#0a1016", padding: 10 }}>{JSON.stringify(log.tasks || tasks, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <TaskList title="You" tasks={tasks} editable={true} onChange={setTasks} />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-accent" onClick={saveLog}>Log today's progress</button>
          </div>
        </div>
      )}
    </div>
  )
}*/