<div align="center">
  <!-- 📸 Replace this with an actual screenshot or banner of Scordo (e.g. a live match scorecard) -->
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Cricket%20Game.png" alt="Scordo Banner" width="90px">
</div>

<h1 align="center">
  🏏 Scordo
</h1>

<p align="center">
  <b>Live cricket scoring & tournament management — built for real matches, in real time.</b>
</p>

<p align="center">
  <a href="http://www.scordo.app/" target="_blank"><strong>🌐 Live App</strong></a> ·
  <a href="#-features"><strong>✨ Features</strong></a> ·
  <a href="#-getting-started"><strong>🚀 Getting Started</strong></a> ·
  <a href="#-how-to-use-scordo"><strong>📖 Usage Guide</strong></a>
</p>

<p align="center">
  <!-- 🔁 Swap "bbinmask/scordo" for your actual GitHub repo path if it's different -->
  <img src="https://img.shields.io/github/stars/bbinmask/scordo?style=for-the-badge&color=FFD700" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/bbinmask/scordo?style=for-the-badge&color=blue" alt="Forks"/>
  <img src="https://img.shields.io/github/last-commit/bbinmask/scordo?style=for-the-badge&color=green" alt="Last Commit"/>
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status"/>
</p>

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="28px" align="center" alt="Lightning Emoji"/> Why Scordo?

<ul>
  <li>🏏 Score a match <strong>ball-by-ball</strong> — runs, wides, no-balls, byes, leg-byes, and wickets — with automatic strike rotation and over tracking.</li>
  <li>⚡ Every viewer sees the score update <strong>instantly</strong>, powered by real-time pub/sub — no refreshing, ever.</li>
  <li>🤖 Optional <strong>AI-generated live commentary</strong> for every ball, with automatic detection of milestones, hat-tricks, and special moments.</li>
  <li>🙋 No account needed — jump straight into <strong>Quick Match</strong> mode and start scoring a casual game in seconds.</li>
  <li>🏆 Organize full <strong>tournaments</strong>, manage team rosters, and track player stats over time.</li>
</ul>

<br/>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png" width="28px" align="center" alt="Laptop Emoji"/> Built With

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat)
![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
<br/>
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat)
![Ably](https://img.shields.io/badge/Ably-FF5416?style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
<br/>
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

<br/>

<div align="center">
  <!-- 🎥 Replace this with a real screen-recording GIF of a live match being scored -->
  <p><i>[Add a GIF of Scordo's live scoring in action here]</i></p>
</div>

<br/>

## ✨ Features

| | |
|---|---|
| 🏏 **Ball-by-ball scoring** | Every delivery recorded with full cricket-law accuracy — wides, no-balls, byes, leg-byes, and wicket types. |
| ⚡ **Real-time sync** | Scorecards update live for every connected viewer, powered by Ably pub/sub. |
| 🤖 **AI commentary** | TV-style commentary generated per ball, with milestone & hat-trick detection. |
| 🙋 **Quick Match mode** | Score a casual match instantly — no login, nothing saved to a server. |
| 👥 **Teams & rosters** | Create teams, recruit players, and manage squads. |
| 🏆 **Tournaments** | Organize multi-team tournaments with configurable formats. |
| 🎖️ **Match officiating** | Assign Scorer / Umpire / Commentator roles — only the assigned scorer can update the score. |
| 📊 **Stats & history** | Batting/bowling stats, match history, and team dashboards. |
| 🤝 **Social features** | Friend requests, team join requests, and tournament invites. |

<br/>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" width="28px" align="center" alt="Rocket Emoji"/> Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))
- Free API keys: [Clerk](https://clerk.com/) · [Ably](https://ably.com/) · [Cloudinary](https://cloudinary.com/) · one AI provider ([Gemini](https://aistudio.google.com/) / [OpenAI](https://platform.openai.com/) / [Groq](https://console.groq.com/))

### 1️⃣ Clone & install

```bash
git clone https://github.com/bbinmask/scordo.git
cd scordo
npm install
```

### 2️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=your_mongodb_connection_string
NEXT_PUBLIC_HOSTNAME=http://localhost:3000

# Clerk (authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding

# Cloudinary (image uploads)
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Ably (real-time)
ABLY_SERVER_API_KEY=your_ably_server_key
ABLY_CLIENT_API_KEY=your_ably_client_key

# AI commentary providers
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

> 💡 In Clerk's dashboard, point your webhook endpoint to `/api/webhooks/clerk` so new sign-ups sync correctly.

### 3️⃣ Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4️⃣ Run it

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

<br/>

## 📖 How to Use Scordo

### 🙋 No account? Try Quick Match

Head to **Quick Match** on the homepage, enter both team names and the number of overs, and start scoring immediately. Everything runs in your browser — nothing touches the server.

### 👤 Setting up your account

1. Sign up / sign in.
2. Complete onboarding — username, role (player or fan), and profile details.

### 👥 Creating a team

1. **Teams → Create Team**.
2. Set a name, unique abbreviation, team type, and optional logo/banner.
3. Invite players, or mark the team as "recruiting" so others can request to join.

### 🏆 Creating a tournament

1. **Tournaments → Create Tournament**.
2. Configure overs, max teams, age limits, entry fee, and prize money.
3. Invite teams, or let them request to join.

### 🏏 Scoring a full match

1. **Matches → Create Match** — pick the two teams, optionally attach a tournament, set the format and venue.
2. Assign match officials — you need at least one **Scorer**; only they can update the score.
3. Start the first innings: choose the opening striker, non-striker, and bowler.
4. Score ball by ball — runs, extras, wickets. Strike rotation and over count update automatically.
5. Everyone watching sees it live, instantly.
6. Turn on AI commentary for automatic, TV-style lines — including special commentary for milestones and hat-tricks.
7. Scordo detects innings/match completion and computes the result on its own.

### 📊 Stats & history

- **Profile** → your batting/bowling stats and match history.
- **Team pages** → roster, stats, and past matches.
- **Explore** → discover public teams, tournaments, and matches.

<br/>

## 🗂️ Project Structure

```
src/
├── actions/         # Server Actions — matches, teams, tournaments, users, invites
├── app/
│   ├── (marketing)/ # Public pages, including Quick Match
│   ├── (platform)/  # Authenticated app — matches, teams, tournaments, profile
│   └── api/         # REST endpoints — Ably auth, Clerk webhook, search, stats
├── components/       # UI components (cards, modals, layouts, shared)
├── hooks/            # Custom hooks & Zustand stores
├── lib/
│   ├── commentary/   # AI commentary engine & event detection
│   ├── match/        # Pure cricket scoring engine (shared by live & Quick Match modes)
│   └── ably-*.ts     # Real-time client/server setup
└── prisma/
    └── schema.prisma # Database schema
```

<br/>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png" width="28px" align="center" alt="Handshake Emoji"/> Contributing

Contributions, issues, and feature requests are welcome — feel free to open an issue or submit a pull request.

## 📄 License

This project is currently unlicensed / all rights reserved.

<br/>

<div align="center">
  <a href="https://www.linkedin.com/in/irfanul-m-84a70a333/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="mailto:irfanulmadar@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
  </a>
  <br/><br/>
  <sub>Built by <a href="https://bbinmask.vercel.app" target="_blank">Irfanul Madar</a></sub>
</div>
