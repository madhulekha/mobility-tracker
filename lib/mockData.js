// Simple deterministic mock data for local/dev when Supabase isn't configured

export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'
export const MOCK_FRIEND_ID = '00000000-0000-0000-0000-000000000002'

function isoDate(offset = 0) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

export function getDummyLogs() {
  // returns last 30 days for each user
  const days = []
  for (let i = -29; i <= 0; i++) {
    days.push(isoDate(i))
  }
  const userLogs = days.map((date, i) => ({
    id: `u-${i}`,
    user_id: MOCK_USER_ID,
    date,
    mobility_done: (i + 5) % 3 !== 0, // roughly 67% complete
    partial: (i + 7) % 4 === 0, // occasional partial
  }))
  const friendLogs = days.map((date, i) => ({
    id: `f-${i}`,
    user_id: MOCK_FRIEND_ID,
    date,
    mobility_done: (i + 3) % 2 === 0, // 50% complete
    partial: (i + 8) % 5 === 0,
  }))
  return [...userLogs, ...friendLogs].sort((a, b) => b.date.localeCompare(a.date))
}

export const GOALS = [
  { id: 'g1', icon: '💪', label: 'Strength training', details: '2 times a week' },
  { id: 'g2', icon: '🍽️', label: 'Lunch at home', details: 'Weekdays' },
  { id: 'g3', icon: '🍽️', label: 'Dinner at home', details: 'Daily' },
]

export function getDummyTodayTasks(userId) {
  if (userId === MOCK_FRIEND_ID) {
    return [
      { id: 'f1', title: '20 min mobility', target: '20 min', status: 'done', note: 'Great session' },
    ]
  }
  return [
    { id: 't1', title: '20 min mobility', target: '20 min', status: 'pending', note: '' },
    { id: 'c1', title: 'Side lunge challenge', target: '30s hold', status: 'pending', note: '' },
  ]
}
