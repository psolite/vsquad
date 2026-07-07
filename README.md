# VSquad — 5-a-Side Fantasy Football · FIFA World Cup 2026

Pick five players. Build your dream squad. Compete with fans worldwide.

---

## How the Game Works

### 1. Connect Your Wallet
VSquad uses a Phantom (Solana) wallet for identity — no transactions, no fees. Your wallet address is your player ID. Connect once and your squad follows you on every device.

### 2. Build Your Squad
Pick exactly **5 players** in a **1 GK · 2 DEF · 2 FWD** formation from the full World Cup 2026 player pool (all 48 nations).

```
        [ FWD ]   [ FWD ]

        [ DEF ]   [ DEF ]

             [ GK ]
```

- Click an empty slot on the pitch to filter the player list by position
- Browse or search by name, country, or position
- Click a player to see their stats, then add them to the squad
- Click a filled slot to swap the player out

### 3. Name and Save Your Squad
Give your squad a name, then hit **Save Squad**. Your squad is saved to the database — you can come back and edit it any time while it is in draft.

### 4. Lock In
When you are happy, hit **Lock Squad**. A locked squad is your final entry — it counts toward tournament scoring and leaderboards. You can still delete it and start fresh, but you cannot partially edit a locked squad.

### 5. Join a Tournament
Head to the **Tournaments** page. You need a saved squad to enter.

| Status | Meaning |
|--------|---------|
| Open | Registration is live — join any time before the start date |
| Live | Competition is running, squads are frozen |
| Ended | Tournament is over, results are final |

You can join multiple tournaments at once. Leave any open tournament before it goes live if you change your mind.

### 6. Create Your Own Tournament
Any connected user can create a tournament. Set the name, prize, dates, and max participants. Anyone with a saved squad can join.

### Scoring
Points are awarded based on real World Cup 2026 match data streamed live via TxOdds. Player goals, clean sheets, and assists feed into your squad's total score. Leaderboards update in real time during matches.

---

## Formations

VSquad uses a fixed **1-2-2** formation:

| Slot | Position |
|------|----------|
| 1 | Goalkeeper (GK) |
| 2 | Defender (DEF) |
| 3 | Defender (DEF) |
| 4 | Forward (FWD) |
| 5 | Forward (FWD) |

You can pick players from any of the 48 World Cup 2026 nations and mix nationalities freely.

---

## Structure

```
vsquad/
├── app/              # Next.js App Router (pages + layouts)
│   ├── (app)/        # Authenticated routes (home, squad, tournaments, fixtures)
│   └── api/          # Route Handlers (squads, tournaments, scores)
├── components/       # Shared UI components
├── lib/
│   ├── api/          # Client-side fetch helpers
│   ├── db.ts         # PostgreSQL via Supabase (pg)
│   └── services/     # Server-side live scoring + TxOdds stream
├── store/            # Zustand state (squadStore)
├── data/             # Static player pool + country data
├── public/           # Static assets (flags, images)
└── instrumentation.ts  # Server startup (DB init + TxOdds stream)
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in DATABASE_DIRECT_URL, SERVER_WALLET_SECRET_KEY, TXODDS_API_TOKEN
```

## Development

```bash
npm run dev
```

Opens at **http://localhost:3000**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET / POST | `/api/squads` | List / upsert squad |
| GET / DELETE | `/api/squads/[wallet]` | Get / delete squad by wallet |
| PATCH | `/api/squads/[wallet]/lock` | Lock a squad |
| GET / POST | `/api/tournaments` | List / create tournaments |
| GET | `/api/tournaments/[id]` | Get tournament by ID |
| POST | `/api/tournaments/[id]/join` | Join a tournament |
| DELETE | `/api/tournaments/[id]/leave` | Leave a tournament |
| GET | `/api/scores/live` | SSE stream — live leaderboard + goals |
| GET | `/api/scores/leaderboard` | Snapshot leaderboard |
| GET | `/api/scores/matches` | Fixtures with live score overlay |
| GET | `/api/scores/points` | Points table |

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Wallet | Solana Wallet Adapter (Phantom) |
| Database | PostgreSQL via Supabase (`pg`) |
| Live data | TxOdds SSE stream |
| Deployment | Vercel / Node.js |
