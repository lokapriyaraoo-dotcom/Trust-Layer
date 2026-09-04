# Trust Layer

**Don’t trust just verify it**

A platform that helps people **find, verify and save** local service professionals with confidence.

---

## Two Sides of Trust Layer

### 1. Customer Side (This App)
This current app is for **customers / users**:

- Search & save trusted local professionals
- Mark them as verified by you
- One-tap Call & WhatsApp
- View profile + QR code
- Keep personal notes and ratings
- Never lose a good plumber/electrician again

### 2. Worker / Business Side (Future)
For service providers (plumbers, electricians, salons, etc.):

- Register their business
- Get verified by Trust Layer
- Receive a public verified profile + QR code
- Collect real customer feedback
- Appear in local search

> The logo works for both sides — the shield + magnifying glass represents verification + discovery.

---

## Current Features (Customer App)

- Add professionals with name, phone, category, area, services, notes & rating
- **Verified badge** (you mark who you have checked)
- Search & category filters
- Call / WhatsApp one-tap
- QR code on every profile
- Profile ID system (TL-XXXXXX)
- Dark / Light mode
- Fully offline (data on your device)
- Installable as PWA

---

## How to Run Locally

```bash
cd trustlayer
npx serve .
# or
python3 -m http.server 3000
```

Open the URL on your phone → “Add to Home Screen”.

---

## How to Release on GitHub + Generate APK

### Step 1: Put on GitHub
1. Create a new public repository named `Trust-Layer`
2. Upload all files in this folder
3. Go to **Settings → Pages** → Enable GitHub Pages (branch: main)
4. Your app will be live at:  
   `https://YOUR_USERNAME.github.io/Trust-Layer/`

### Step 2: Generate Android APK (for Uptodown / direct download)
1. Make sure the site is live (GitHub Pages or Netlify)
2. Go to → https://www.pwabuilder.com
3. Enter your live URL
4. Click **Package for Stores** → choose **Android**
5. Download the `.apk` file
6. Upload the APK to:
   - GitHub **Releases** (so people can download it)
   - Uptodown (alternative app store)

### Step 3: Uptodown
1. Create developer account on uptodown.com
2. Submit the APK + screenshots + description
3. Wait for review

---

## Logo

The official logo is included as `logo.jpg`.

---

**Trust Layer** — Don’t trust just verify it.
