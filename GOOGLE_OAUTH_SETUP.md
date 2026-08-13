# 🔐 Google OAuth Setup Guide

This guide walks you through configuring Google OAuth for RoastMy.cv sign-in.

**Time required**: ~5 minutes

---

## 1. Create a Google Cloud project

1. Go to <https://console.cloud.google.com/>
2. Click the project dropdown (top bar) → **New Project**
3. Name it `roastmy-cv` (or whatever you like) → **Create**
4. Switch to the new project from the dropdown

---

## 2. Configure the OAuth consent screen

The consent screen is what users see when they sign in with Google.

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **User type**:
   - **External** — for any Google user (you'll need to add yourself as a test user while in testing mode)
   - **Internal** — only if you're on a Google Workspace (recommended for company-only apps)
3. Fill in:
   - **App name**: `RoastMy.cv`
   - **User support email**: your email
   - **App logo**: optional, square PNG (use `public/logo.svg` converted to PNG if you want)
   - **Application home page**: `https://roastmy-cv.vercel.app`
   - **Application privacy policy URL**: `https://roastmy-cv.vercel.app/privacy` (create this page later)
   - **Application terms of service URL**: `https://roastmy-cv.vercel.app/terms` (optional)
   - **Authorized domains**: `roastmy-cv.vercel.app` (and any custom domain you own)
   - **Developer contact information**: your email
4. Click **Save and Continue**
5. **Scopes** page → click **Add or Remove Scopes**:
   - Select `userinfo.email` (Email address)
   - Select `userinfo.profile` (Basic profile info)
   - Click **Update** → **Save and Continue**
6. **Test users** page → add your own Google account email (and any other testers) → **Save and Continue**

> While the app is in **Testing** mode, only emails in this list can sign in. To allow anyone, you'll need to publish the app (see step 5 below).

---

## 3. Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → OAuth client ID**
3. Fill in:
   - **Application type**: `Web application`
   - **Name**: `RoastMy.cv Web Client`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://roastmy-cv.vercel.app
     ```
     (Add any other domains you'll deploy to, e.g. `https://roastmy.cv`)
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     https://roastmy-cv.vercel.app/api/auth/callback/google
     ```
     (The path `/api/auth/callback/google` is required by NextAuth.js)
4. Click **Create**
5. A dialog will appear with your **Client ID** and **Client Secret** — copy both

Add them to your environment:

```bash
# .env (local)  or  Vercel → Project Settings → Environment Variables
GOOGLE_CLIENT_ID="xxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
```

---

## 4. Test the sign-in flow

1. Make sure your `.env` has:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL="http://localhost:3000"` (local) or your Vercel URL (prod)
2. Start the dev server: `bun run dev`
3. Visit <http://localhost:3000>
4. Click **Sign in** in the top-right
5. Choose your Google account (must be one of the test users from step 2.6)
6. Grant permissions
7. You should be redirected back to the app, signed in

---

## 5. Publish the app (allow anyone to sign in)

While the app is in **Testing** mode, only emails you've added as test users can sign in. To allow anyone with a Google account:

1. Go to **OAuth consent screen → Publishing status**
2. Click **Push to production**
3. Click **Confirm**

> For most apps, this is enough. Google may require verification if you're requesting sensitive scopes — but `userinfo.email` and `userinfo.profile` are non-sensitive, so you should be fine.

If you ever request restricted scopes (Drive, Gmail, etc.) — which this app doesn't — Google will require a security assessment before publishing. Not relevant here.

---

## Troubleshooting

### `Error 400: redirect_uri_mismatch`

The redirect URI sent by NextAuth doesn't match what's configured in Google Cloud Console. Double-check the **Authorized redirect URIs** list (step 3.3) — it must include the exact URL including `https://` and the path `/api/auth/callback/google`.

### `Error 403: access_denied`

The user is trying to sign in but isn't in your test users list. Either add them as a test user (step 2.6) or publish the app (step 5).

### Sign-in works locally but not on Vercel

- Verify `NEXTAUTH_URL` in your Vercel env vars is `https://your-app.vercel.app` (not `localhost`)
- Verify the Vercel URL is in the Google Cloud **Authorized redirect URIs** list
- Restart the Vercel deployment after adding env vars (Deployments → Redeploy)

### `NEXTAUTH_SECRET` is missing

Generate one:

```bash
openssl rand -base64 32
```

Add it to `.env` and to Vercel env vars.

### User signs in but `plan` shows as `free` even though they paid

The NextAuth JWT caches the `plan` claim at sign-in time. After a successful Stripe checkout, the user needs to:

1. Sign out (top-right menu → Sign out)
2. Sign back in

The new session will pick up the updated `plan: 'pro'` from the database.

(We could fix this by adding a `/api/auth/refresh-session` endpoint that re-issues the JWT — see roadmap.)

---

## Need help?

- NextAuth.js docs: <https://next-auth.js.org/providers/google>
- Google OAuth docs: <https://developers.google.com/identity/protocols/oauth2/web-server>
- Google Cloud Console: <https://console.cloud.google.com/>
