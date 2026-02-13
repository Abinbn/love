# Quick Start - 3 Steps to Fix Everything

## Step 1: Get Supabase Credentials (5 minutes)
1. Go to https://supabase.com
2. Create new project → wait 2 minutes
3. Run SQL from `supabase-schema.sql` in SQL Editor
4. Copy URL and anon key from Project Settings → API

## Step 2: Update .env.local
```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR-ACTUAL-KEY
VITE_GEMINI_API_KEY=YOUR-GEMINI-KEY  # Optional
```

## Step 3: Restart Server
```bash
npm run dev
```

## ✅ You're Done!
- Visit http://localhost:5173
- Create a confession
- It will save to Supabase
- Song will auto-play
- AI will enhance (if key added)

---

**Need more help?** Read `SETUP_GUIDE.md` for detailed instructions.
