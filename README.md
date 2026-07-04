# VSquad — 5-a-Side Fantasy Football · FIFA World Cup 2026

Pick five players. Build your dream squad. Compete with fans worldwide.

---

## How the Game Works

### 1. Connect Your Wallet
VSquad uses a Phantom (Solana) wallet for identity — no transactions, no fees. Your wallet address is your player ID. Connect once and your squad follows you on every device.

### 2. Build Your Squad
Pick exactly **5 players** in a **1 GK · 2 DEF · 2 FWD** formation from the full World Cup 2026 player pool (all 32 nations).

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
Give your squad a name, then hit **Save Squad**. Your squad is saved to the server — you can come back and edit it any time while it is in draft.

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

You can pick players from any of the 32 World Cup 2026 nations and mix nationalities freely.

---

## Structure

```
vsquad/
├── client/   # React + TypeScript (Vite)
├── server/   # Express + TypeScript
└── package.json
```

## Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
```

## Development

```bash
npm run dev
```

Starts both servers concurrently:

| Service | URL |
|---------|-----|
| Client  | http://localhost:5173 |
| Server  | http://localhost:3001 |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server in development |
| `npm run build` | Build both for production |
| `npm run install:all` | Install deps in client and server |

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router v6 |
| Wallet | Solana Wallet Adapter (Phantom) |
| Backend | Node.js + Express + TypeScript |
| Database | JSON file (Supabase-ready) |
| Live data | TxOdds SSE stream |
