# 🔥 RoastMy.cv

**Get your resume roasted by AI.** Free, anonymous, shareable.

Paste your resume → pick a mode → get brutally honest AI feedback in 10 seconds. Three modes: Brutal Roast 🔥, Pro Feedback 💼, or Job Match 🎯.

Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and GLM (via `z-ai-web-dev-sdk`).

---

## ✨ Features

- 🎭 **3 modes**: Brutal Roast (funny/savage), Pro Feedback (FAANG recruiter style), Job Match (vs. specific role)
- 🌍 **10 languages**: English, Türkçe, Deutsch, Español, Français, Italiano, Português, Русский, Nederlands, 中文 — auto-detected from browser
- 📊 **Scored**: AI gives 0-100 score with animated progress ring
- 🎨 **Beautiful dark UI**: glassmorphism, Framer Motion animations, mobile-first
- 🔗 **Shareable**: every roast gets a unique URL (`/#/r/epic-falcon-8448`)
- 🌐 **Public gallery**: see latest public roasts (anonymous)
- ⚡ **Free tier**: 3 roasts/day per IP, no signup
- 💎 **Pro tier** (UI ready): unlimited, PDF upload, LinkedIn import, cover letters
- 🔒 **Privacy-first**: resumes truncated before storage, no PII collected

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh)
- A Z.ai API key (the `z-ai-web-dev-sdk` is pre-bundled in this repo's environment; for self-hosting, set `ZAI_API_KEY`)

### Install

```bash
git clone https://github.com/titkenan/roastmy-cv.git
cd roastmy-cv
bun install   # or: npm install
```

### Set up environment

```bash
cp .env.example .env
# Edit .env:
#   DATABASE_URL="file:./db/roast.db"
#   ZAI_API_KEY="your-zai-api-key"
```

### Initialize database

```bash
bun run db:push
```

### Run dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite via Prisma ORM |
| AI | GLM via `z-ai-web-dev-sdk` |
| Animations | Framer Motion |
| Auth (Pro tier) | NextAuth.js v4 (ready, not yet wired) |
| Deployment | Vercel (recommended) |

---

## 📁 Project Structure

```
roastmy-cv/
├── prisma/
│   └── schema.prisma          # Roast + UsageStat models
├── public/
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── page.tsx           # Single-page app (hero + input + result + gallery)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── roast/route.ts          # POST: AI roast generation
│   │       ├── roast/[slug]/route.ts   # GET: shared roast
│   │       └── gallery/route.ts        # GET: public gallery
│   ├── components/ui/         # shadcn/ui components
│   ├── hooks/                 # use-mobile, use-toast
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── roast-types.ts     # Shared types + i18n strings
│       └── utils.ts
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🤖 How the AI works

The `/api/roast` endpoint:

1. Validates input (50–12000 chars)
2. Checks rate limit (3/day per IP hash)
3. Builds a system prompt based on mode (`roast` / `professional` / `jobmatch`) and language
4. Calls GLM via `z-ai-web-dev-sdk` with `thinking: disabled` for speed
5. Parses JSON response (with markdown-fence fallback)
6. Persists to SQLite with a random anonymous nickname + shareable slug
7. Returns structured result: `{ title, score, emoji, summary, burns[], feedback[], suggestions[] }`

The AI is prompted to:
- **Burns**: be funny/savage but never attack identity (no racism, sexism, etc.)
- **Feedback**: be genuinely useful and professional
- **Suggestions**: be specific and actionable (not "improve skills" → "add metrics like 'increased X by Y%'")

---

## 🔐 Privacy

- Resumes are **truncated to 8000 chars** before storage
- **No names, emails, or PII** are extracted — the AI sees raw text only
- **IP addresses are hashed** (SHA-256, truncated) for rate limiting, never stored raw
- Public gallery shows only anonymous nicknames (e.g. "Brave Designer")
- Toggle "Make my roast public" off → roast is private, only you see the link

---

## 💎 Pro Tier (Roadmap)

The pricing UI is built and visible in-app. To activate:

- [ ] Stripe Checkout integration ($5/month)
- [ ] NextAuth.js Google OAuth for Pro accounts
- [ ] PDF upload + text extraction (pdf-parse)
- [ ] LinkedIn URL → resume text scraper
- [ ] Cover letter generator (separate AI endpoint)
- [ ] Remove watermarks on Pro roasts
- [ ] Priority AI model (GLM-4.6 instead of GLM-4.5-Air)

---

## 🛣️ Roadmap

- [ ] **v1.1**: PDF upload + LinkedIn import
- [ ] **v1.2**: Stripe + Pro tier launch
- [ ] **v1.3**: Cover letter generator + LinkedIn optimizer
- [x] **v1.4**: Multi-language (EN / TR / DE / ES / FR / IT / PT / RU / NL / ZH) ✅
- [ ] **v1.5**: Team plans (recruiters can roast multiple candidates)
- [ ] **v2.0**: AI-powered resume rewriter (not just feedback)

---

## 📈 Viral Mechanics

1. **Free + anonymous** = low friction → anyone tries
2. **Funny roast titles** ("Resume So Basic It's Practically Open Source") = shareable
3. **One-click Twitter share** with prefilled text
4. **Public gallery** = social proof + FOMO
5. **Unique URLs** = perfect for Slack/Discord/Reddit shares
6. **Daily limit** = scarcity → come back tomorrow

---

## 🚢 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add environment variables:
   - `DATABASE_URL` — use Vercel Postgres (free tier) or `file:./db/roast.db` for ephemeral
   - `ZAI_API_KEY` — your Z.ai API key
5. Deploy

> **Note**: For production, use Vercel Postgres (free 60h/month compute + 256MB DB) instead of SQLite. Update `prisma/schema.prisma` `provider` to `postgresql`.

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

Built in one evening with the help of AI (GLM + Z.ai). Yes, the irony is not lost on us.
