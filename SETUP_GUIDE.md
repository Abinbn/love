# 🚀 Setup Guide - Valentine's Confessions App

## ⚠️ IMPORTANT: Fix the "Failed to load resource" Error

The error you're seeing happens because Supabase credentials aren't configured yet. Follow these steps:

### Step 1: Set Up Supabase Database

1. **Go to [https://supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project**
   - Choose a name (e.g., "valentines-confessions")
   - Set a database password (save it!)
   - Choose a region close to you
   - Wait for the project to be created (~2 minutes)

3. **Run the SQL Schema**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the **entire** content from `supabase-schema.sql`
   - Paste it and click "Run"
   - You should see "Success" messages

4. **Get Your Credentials**
   - Go to Project Settings (gear icon in sidebar)
   - Click "API" section
   - Copy the following:
     - **Project URL** (looks like: `https://xxx.supabase.co`)
     - **anon public key** (long string starting with `eyJ...`)

### Step 2: Configure Environment Variables

1. **Open `.env.local` file** in your project
2. **Replace the placeholder values:**

```bash
# Replace these with your ACTUAL Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_actual_key_here

# Keep these as is
VITE_APP_NAME="Valentine's Confessions"
VITE_DELIVERY_DATE="2026-02-14T00:00:00"
VITE_ENABLE_ADMIN_PANEL=true

# Optional: Add your Gemini API key for AI-powered confessions
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Save the file** (Ctrl+S / Cmd+S)

### Step 3: Get Gemini API Key (Optional - For AI Enhancement)

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy it to `.env.local` as shown above

**Note:** AI enhancement is optional. If you don't add the key, confessions will still work perfectly!

### Step 4: Restart the Dev Server

```bash
# Stop the current server (Ctrl+C in terminal)
npm run dev
```

The app will now connect to your Supabase database!

---

## ✨ New AI Features

### 1. **AI-Powered Confession Enhancement**
- Toggle AI enhancement on/off in the confession form
- Gemini 2.0 Flash will beautify user messages
- Makes confessions more romantic and heartfelt
- Keeps the original mood and sentiment

### 2. **Auto-Playing Music** 🎵
- **YouTube**: Embedded player with autoplay
- **Spotify**: Embedded player
- **Other links**: Clickable link with music icon

### Supported Music Formats:
- `https://youtube.com/watch?v=xxx`
- `https://youtu.be/xxx`
- `https://open.spotify.com/track/xxx`
- Any other music link (displays as clickable link)

---

## 🧪 Testing the App

### Test Confession Submission:

1. **Go to** `http://localhost:5173/confess`
2. **Fill out the form:**
   - Write a message (try: "I really like you and wanted to tell you on Valentine's Day")
   - Select a mood
   - Add a song link (try a YouTube or Spotify link)
   - Add college details
   - Choose anonymous or reveal your identity
3. **Click Next** through the steps
4. **On Step 3**, if AI is enabled, it will enhance your message
5. **Preview and Submit**

### Test Confession Viewing:

1. After submission, you'll be redirected to the confession page
2. The song should auto-play (if YouTube/Spotify)
3. You'll see the enhanced message
4. Try adding reactions

### Test Letter Finding:

1. **Go to** `http://localhost:5173/search`
2. **Enter the 8-character code** from your confession
3. **View the confession**

---

## 🎨 How AI Enhancement Works

When you:
1. Fill out the confession form
2. Enable AI Enhancement (toggle in header)
3. Click "Next" on Step 3

The app will:
1. Show a beautiful loading screen ✨
2. Send your message + metadata to Gemini
3. Receive a beautified, romantic version
4. Show it in the preview (Step 4)
5. Save the enhanced version to database

**Example:**
- **Original:** "I like you and wanted to say hi"
- **AI Enhanced:** "There's been something I've wanted to tell you for a while now... Every time I see you, my day gets a little brighter. This Valentine's Day felt like the perfect moment to finally say: I really like you. Happy Valentine's Day! 💝"

---

## 📝 Quick Checklist

- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] `.env.local` updated with real credentials
- [ ] Gemini API key added (optional)
- [ ] Dev server restarted
- [ ] Test confession submitted successfully
- [ ] Music auto-plays when viewing confession
- [ ] AI enhancement working (if enabled)

---

## 🐛 Troubleshooting

### Error: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"
**Solution:** Update `.env.local` with your actual Supabase URL and key

### Error: "Failed to send confession"
**Solution:** 
1. Check if Supabase credentials are correct
2. Verify SQL schema was executed
3. Check browser console for specific error

### AI Enhancement Not Working
**Solution:**
1. Verify Gemini API key is correct in `.env.local`
2. Check if you have API quota remaining
3. Look for error messages in browser console

### Song Not Auto-Playing
**Solution:**
1. Some browsers block autoplay - user needs to interact with page first
2. YouTube links should be in format: `https://youtube.com/watch?v=xxx`
3. Spotify links: `https://open.spotify.com/track/xxx`

---

## 🎉 You're All Set!

Once Supabase is configured, everything will work perfectly:
- ✅ Confessions save to database
- ✅ Search by unique code works
- ✅ Songs auto-play
- ✅ AI enhancement beautifies messages
- ✅ Admin panel shows all confessions

**Happy Valentine's Day! 💝**
