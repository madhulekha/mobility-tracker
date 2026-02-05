import { supabaseServer } from '../../../lib/supabaseServer'

export async function POST(req) {
  try {
    const body = await req.json()
    const { user_id, date, event, tasks } = body
    if (!user_id || !date || !event) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 })

    // fetch existing row for user/date
    const { data: existing, error: fetchError } = await supabaseServer
      .from('daily_logs')
      .select('id, events, tasks')
      .eq('user_id', user_id)
      .eq('date', date)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "row not found" in some supabase versions; ignore
    }

    const existingEvents = (existing && existing.events) || []
    const nextEvents = [...existingEvents, event]

    // Prepare upsert payload
    const payload = {
      user_id,
      date,
      events: nextEvents,
      tasks: tasks || (existing && existing.tasks) || null,
      updated_at: new Date().toISOString(),
      mobility_done: (tasks || (existing && existing.tasks) || []).some?.((t) => t.status === 'done') || false,
      partial: (tasks || (existing && existing.tasks) || []).some?.((t) => t.status === 'partial') || false,
    }

    const { data, error } = await supabaseServer
      .from('daily_logs')
      .upsert(payload, { onConflict: ['user_id', 'date'] })

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
