# 🔥 RoastMy.cv

**Get your resume roasted by AI.** Free, anonymous, shareable.

Paste your resume → pick a mode → get brutally honest AI feedback in 10 seconds. Three modes: Brutal Roast 🔥, Pro Feedback 💼, or Job Match 🎯.

Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, Stripe, and GLM (via `z-ai-web-dev-sdk`).

**Live**: <https://roastmy-cv.vercel.app/>

---

## ✨ Features

- 🎭 **3 modes**: Brutal Roast (funny/savage), Pro Feedback (FAANG recruiter style), Job Match (vs. specific role)
- 🌍 **10 languages**: English, Türkçe, Deutsch, Español, Français, Italiano, Português, Русский, Nederlands, 中文 — auto-detected from browser
- 📊 **Scored**: AI gives 0-100 score with animated progress ring
- 🎨 **Beautiful dark UI**: glassmorphism, Framer Motion animations, mobile-first
- 🔗 **Shareable**: every roast gets a unique URL (`/r/epic-falcon-8448`)
- 🌐 **Public gallery**: see latest public roasts (anonymous)
- ⚡ **Free tier**: 3 roasts/day per IP, no signup required
- 💎 **Pro tier** ($5/month): unlimited roasts, Google sign-in, Stripe-billed, cancel anytime
- 🔐 **Google OAuth**: NextAuth.js v4 + Prisma adapter
- 💳 **Stripe Subscriptions**: Checkout + Webhooks + Customer Portal
- 🔒 **Privacy-first**: resumes truncated before storage, IPs hashed (SHA-256)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh)
- A Z.ai API key (the `z-ai-web-dev-sdk` is pre-bundled in this dev environment; for self-hosting, set `ZAI_API_KEY`)
- (Optional, for Pro tier) Stripe account in test mode
- (Optional, for Pro tier) Google Cloud project with OAuth credentials

### Install

```bash
git clone https://github.com/titkenan/roastmy-cv.git
cd roastmy-cv
bun install   # or: npm install
```

### Set up environment

```bash
cp .env.example .env
```

Edit `.env` — see [`.env.example`](./.env.example) for full reference. Minimum to run the free tier:

```bash
DATABASE_URL="file:./db/roast.db"
NEXTAUTH_SECRET="generate-a-random-32-char-string"   # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

For the **Pro tier** you also need (see [STRIPE_SETUP.md](./STRIPE_SETUP.md) and [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)):

```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Initialize database

```bash
bun run db:push
```

### Run dev server

```bash
bun run dev
```

Open <http://localhost:3000>.

### Local Stripe webhook testing

To test the Stripe webhook locally, use the Stripe CLI:

```bash
# Install: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite via Prisma ORM (Postgres for production recommended) |
| AI | GLM via `z-ai-web-dev-sdk` |
| Animations | Framer Motion |
| Auth | NextAuth.js v4 (Google OAuth, JWT sessions) |
| Billing | Stripe Subscriptions + Customer Portal |
| Deployment | Vercel |

---

## 📁 Project Structure

```
roastmy-cv/
├── prisma/
│   └── schema.prisma              # Roast, UsageStat, User, Account, Session, VerificationToken
├── public/
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── page.tsx               # Single-page app (hero + input + result + gallery + pricing)
│   │   ├── layout.tsx             # SessionProvider + Toaster
│   │   ├── globals.css
│   │   └── api/
│   │       ├── roast/route.ts             # POST: AI roast generation (Pro-aware rate limit)
│   │       ├── roast/[slug]/route.ts      # GET: shared roast
│   │       ├── gallery/route.ts           # GET: public gallery
│   │       ├── me/route.ts                # GET: current user + plan
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth.js handler
│   │       └── stripe/
│   │           ├── checkout/route.ts      # POST: create Stripe Checkout session
│   │           ├── webhook/route.ts       # POST: Stripe webhook handler
│   │           └── portal/route.ts        # POST: create Customer Portal session
│   ├── components/ui/             # shadcn/ui components
│   ├── components/session-provider.tsx
│   ├── hooks/                     # use-mobile, use-toast
│   └── lib/
│       ├── db.ts                  # Prisma client (singleton)
│       ├── auth.ts                # NextAuth config + plan in JWT
│       ├── stripe.ts              # Stripe client + Pro helpers + rate limits
│       ├── roast-types.ts         # Shared types + 10-language i18n strings
│       └── utils.ts
├── .env.example
├── STRIPE_SETUP.md                # How to configure Stripe Dashboard
├── GOOGLE_OAUTH_SETUP.md          # How to configure Google Cloud Console
├── vercel.json
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🤖 How the AI works

The `/api/roast` endpoint:

1. Validates input (50–12000 chars)
2. Resolves the user's plan (Pro if authenticated + subscribed, Free otherwise)
3. Checks rate limit — Free: 3/day per IP, Pro: 100/day per IP
4. Builds a system prompt based on mode (`roast` / `professional` / `jobmatch`) and language
5. Calls GLM via `z-ai-web-dev-sdk` with `thinking: disabled` for speed
6. Parses JSON response (with markdown-fence fallback)
7. Persists to SQLite with a random anonymous nickname + shareable slug
8. Returns structured result: `{ title, score, emoji, summary, burns[], feedback[], suggestions[] }`

The AI is prompted to:

- **Burns**: be funny/savage but never attack identity (no racism, sexism, etc.)
- **Feedback**: be genuinely useful and professional
- **Suggestions**: be specific and actionable (not "improve skills" → "add metrics like 'increased X by Y%'")

---

## 💳 Stripe + Pro Tier (Live)

The full subscription flow is implemented:

| Step | Endpoint | Description |
|------|----------|-------------|
| Upgrade | `POST /api/stripe/checkout` | Creates a Stripe Checkout session ($5/month subscription) |
| Webhook | `POST /api/stripe/webhook` | Handles `checkout.session.completed`, `customer.subscription.created/updated/deleted` |
| Manage | `POST /api/stripe/portal` | Opens the Stripe Customer Portal (cancel, update card, view invoices) |

When a subscription becomes `active` or `trialing`, the user's `plan` is set to `"pro"` in the database and the rate limit is lifted (up to 100 roasts/day). When the subscription is canceled, the webhook flips `plan` back to `"free"`.

**Setup instructions**: see [STRIPE_SETUP.md](./STRIPE_SETUP.md).

**Google OAuth setup**: see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md).

---

## 🔐 Privacy

- Resumes are **truncated to 8000 chars** before storage
- **No names, emails, or PII** are extracted — the AI sees raw text only
- **IP addresses are hashed** (SHA-256, truncated to 32 chars) for rate limiting, never stored raw
- Public gallery shows only anonymous nicknames (e.g. "Brave Designer")
- Toggle "Make my roast public" off → roast is private, only you see the link
- Stripe customer IDs are stored on the `User` record — no card numbers ever touch our database

---

## 🛣️ Roadmap

- [x] **v1.0**: Initial release — AI Resume Roaster 🔥
- [x] **v1.4**: Multi-language (EN / TR / DE / ES / FR / IT / PT / RU / NL / ZH)
- [x] **v1.5**: Stripe + Pro tier + Google OAuth (subscriptions live)
- [ ] **v2.0**: PDF upload + text extraction (pdf-parse)
- [ ] **v2.1**: LinkedIn URL → resume text scraper
- [ ] **v2.2**: Cover letter generator (separate AI endpoint)
- [ ] **v2.3**: Priority AI model (GLM-4.6 instead of GLM-4.5-Air) for Pro users
- [ ] **v3.0**: Team plans (recruiters can roast multiple candidates)
- [ ] **v3.1**: AI-powered resume rewriter (not just feedback)

---

## 📈 Viral Mechanics

1. **Free + anonymous** = low friction → anyone tries
2. **Funny roast titles** ("Resume So Basic It's Practically Open Source") = shareable
3. **One-click Twitter share** with prefilled text
4. **Public gallery** = social proof + FOMO
5. **Unique URLs** = perfect for Slack/Discord/Reddit shares
6. **Daily limit** = scarcity → come back tomorrow (or upgrade to Pro)

---

## 🚢 Deploy to Vercel

1. Push this repo to GitHub (already deployed at <https://roastmy-cv.vercel.app/>)
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo (or just connect the GitHub repo for auto-deploy)
3. Add all environment variables from `.env.example` in **Project Settings → Environment Variables**
4. For production, switch the database to **Vercel Postgres** (free tier):
   - Update `prisma/schema.prisma` `provider` to `"postgresql"`
   - Set `DATABASE_URL` to the Vercel Postgres connection string
   - Run `bun run db:push` against the production DB
5. In Stripe Dashboard, set the webhook endpoint to `https://your-domain.vercel.app/api/stripe/webhook`
6. In Google Cloud Console, add `https://your-domain.vercel.app/api/auth/callback/google` as an authorized redirect URI

---

## 🤝 Contributing

PRs welcome! Especially:

- More language translations (edit `src/lib/roast-types.ts` `UI_TEXT`)
- Better AI prompts (edit `src/app/api/roast/route.ts` `buildSystemPrompt`)
- New modes (e.g. "Roast my GitHub profile", "Roast my LinkedIn")
- UI improvements

---

## 📜 License

MIT — see [LICENSE](LICENSE).

---

## ⭐ Star History

If this project made you laugh, give it a star — it helps others discover it.

[![Star History Chart](https://api.star-history.com/svg?repos=titkenan/roastmy-cv&type=Date)](https://star-history.com/#titkenan/roastmy-cv&Date)

---

## 🔥 Made with fire by [titkenan](https://github.com/titkenan)

Built with the help of AI (GLM + Z.ai). Yes, the irony is not lost on us.
