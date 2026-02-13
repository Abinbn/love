# Logo Placement Guide

## 📁 Where to Place Your Logo

**File:** `esb-logo.png`

**Location:** `public/esb-logo.png`

### Quick Steps:

1. **Find the logo file** on your computer
2. **Copy it** to the project's `public` folder:
   ```
   wish-for-a-star/
   ├── public/
   │   ├── esb-logo.png  ← PUT IT HERE
   │   ├── vite.svg
   │   └── manifest.json
   ├── src/
   └── ...
   ```

3. **That's it!** The logo will automatically appear on the home page.

---

## 🎨 Logo Specifications

### Recommended Format:
- **Format**: PNG with transparent background
- **Dimensions**: At least 200px wide for clarity
- **File size**: Under 100KB for fast loading

### Where it Appears:

#### 1. Header (Top of Home Page)
- **Size on mobile**: 48px height
- **Size on desktop**: 64px height
- **Position**: Center top
- **Effect**: Slight opacity hover

#### 2. Footer (Bottom of Home Page)
- **Size on mobile**: 32px height
- **Size on desktop**: 40px height
- **Position**: Center, above copyright text
- **Effect**: Slight opacity hover

---

## 🔄 Alternative: Use a Different File Name

If your logo file has a different name (e.g., `logo.png`, `brand.png`), you have two options:

### Option 1: Rename the file
```bash
# Rename your logo to esb-logo.png
```

### Option 2: Update the code
Edit these files and change `/esb-logo.png` to your filename:
- `src/pages/Home.jsx` (2 places: header and footer)

---

## ✅ Verification

After adding the logo:

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open** `http://localhost:5173`

3. **Check:**
   - Logo appears at the top
   - Logo appears in the footer
   - No broken image icon
   - Hover makes it slightly brighter

4. **If logo doesn't appear:**
   - Check file path: `public/esb-logo.png`
   - Check file name spelling
   - Check browser console for errors
   - Try hard refresh: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)

---

## 🚀 For Production (Vercel)

When deploying to Vercel:

1. The logo in `public/` folder will automatically be deployed
2. No extra configuration needed
3. Logo will work on live site

---

**That's it! Just drop the file in `public/` and you're done! 🎉**
