You are a senior software developer helping me build this vision of mine for a february challenge with a friend to feel better by the end of the month. 

I want to build a web-based personal + friend mobility tracker inspired by Duolingo, with a playful and motivational feel. Please generate a Next.js + Supabase prototype with the following features:

Core Pages / Features:

Homepage / Dashboard

Show my streak with a 🔥 emoji or progress bar.

Show friend’s streak side by side (friend logs in separately).

Optional 7-day mini calendar showing ✅ for done, ⚠️ for partial, ❌ for missed.

Display motivational messages: e.g., “You’re on fire 🔥!”, “Your friend needs a nudge 🏃‍♂️”.

Daily Page / To-do list

Default task: “20 min mobility”.

Optional challenge tasks: e.g., “Hold squat X secs”, “Side lunge challenge”, etc., with input fields for actual performance.

Each task can have:

✅ Met target

⚠️ Partial (soft input / notes like “did 20s out of 30s”)

❌ Not done

Allow a small comment/notes field per task.

Show fun feedback messages when task is logged, e.g., “Nice! Keep it up!” or “Almost there, try tomorrow 💪”.

Friend Progress / Nudges

Show friend’s daily progress (streak + completed/partial/not done tasks).

Highlight if a friend hasn’t completed their tasks today, optionally suggest sending a nudge.

Optional emojis to indicate progress: 🔥 streak, ⚡ partial, 💤 missed.

History / Analytics Page

Table or calendar of past days showing completion status.

Graph or visual streak overview.

Content / Reference Page

Static page with links to mobility exercises, tips, common notes.

Technical Requirements / Notes:

Use Supabase for auth + database (or equivalent).

Each user has private logs, can see friend’s progress in a safe way.

Daily tasks support both binary yes/no and soft inputs/notes.

Include target setting and ability to log numeric results.

Include basic navigation between pages.

UI should be functional and playful — consider emojis, streak fire 🔥, motivational messages.

Client-friendly Next.js App Router setup to avoid SSR hydration errors.

Provide database schema, env variables, example data.

Include minimal streak calculation + friend view logic.

Output a ready-to-run prototype with folder structure, pages, components, and Supabase client setup.