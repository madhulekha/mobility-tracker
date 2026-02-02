"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })
    if (error) alert(error.message)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user)
    return (
      <div style={{ padding: 40 }}>
        <h2>Welcome, {user.email}</h2>
        <button onClick={() => router.push("/today")}>Go to Today</button>
        <button onClick={signOut} style={{ marginLeft: 10 }}>Sign Out</button>
      </div>
    )

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  )
}
