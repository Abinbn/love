# 💝 Valentine's Confessions - React App

A full-featured anonymous confession platform for college students built with React, Supabase, and Tailwind CSS.

## ✨ Features

### Core Functionality
- **Multi-step confession form** with 4 beautiful steps
- **Anonymous or revealed** confessions
- **College-specific fields** (name, department, year, section)
- **Unique 8-character codes** for finding confessions
- **Reactions system** (hearts, smiles, tears)
- **Admin panel** with statistics and moderation
- **Mobile-first design** with haptic feedback
- **Valentine's Day countdown** timer

### Technical Features
- **Supabase backend** with PostgreSQL
- **Row Level Security (RLS)** for data protection
- **Real-time updates** with Supabase Realtime
- **Form validation** with Zod and React Hook Form
- **Draft saving** with localStorage
- **Responsive design** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Haptic feedback** for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- npm or yarn

### 1. Set up Supabase

1. Create a new proyecto on [Supabase](https://supabase.com)
2. Go to the SQL Editor
3. Run the SQL schema from `supabase-schema.sql`
4. Get your project URL and anon key from Settings > API

### 2. Install & Configure

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── ...
├── pages/               # Route pages
│   ├── Home.jsx         # Landing page with countdown
│   ├── Confess.jsx      # Multi-step confession form
│   ├── Search.jsx       # Find confessions by code
│   ├── ViewConfession.jsx  # Display single confession
│   ├── Admin.jsx        # Admin panel
│   └── NotFound.jsx     # 404 page
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configuration
│   ├── supabase.js      # Supabase client
│   ├── validation.js    # Zod schemas
│   ├── utils.js         # Helper functions
│   └── constants.js     # App constants
└── styles/              # Global styles
```

## 🗄️ Database Schema

The app uses the following main tables:
- **confessions**: Stores all confession data
- **confession_reactions**: Tracks reactions to confessions
- **admin_users**: Manages admin access

See `supabase-schema.sql` for the complete schema with indexes, functions, and RLS policies.

## 🔐 Admin Panel

To access the admin panel:
1. Add your email to the `admin_users` table in Supabase
2. Visit `/admin` route
3. Note: Proper Supabase Auth integration is recommended for production

## 📱 Mobile Features

- **Haptic feedback** on all interactions
- **Responsive design** optimized for mobile-first
- **Touch-friendly** UI elements
- **PWA support** (coming soon)

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
theme: {
  extend: {
    colors: {
      primary: { ... },  // Main pink/red colors
      dark: { ... },     // Background colors
    },
  },
},
```

### Valentine's Day Date
Change the delivery date in `.env.local`:
```bash
VITE_DELIVERY_DATE="2026-02-14T00:00:00"
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

The `vercel.json` configuration is already included.

### Other Platforms

The app works on any static hosting platform. Just run `npm run build` and deploy the `/dist` folder.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Supabase** - Backend and database
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Validation
- **React Router** - Routing
- **Lucide React** - Icons

## 📝 License

MIT License - feel free to use for your college Valentine's event!

## 💖 Made with Love

Built for Valentine's Day 2026 🌹

---

**Need help?** Check the Supabase docs or create an issue on GitHub.
