# VSquad — 5-a-side Fantasy Football

Pick your 5-a-side squad, compete in leagues, and track your points in real time.

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

- **Frontend** — React 19, Vite, TypeScript
- **Backend** — Node.js, Express, TypeScript, ts-node-dev
