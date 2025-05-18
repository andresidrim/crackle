# 🔐 Crackle — A Multiplayer Code Guessing Game

Crackle is a fast-paced, two-player game where each player sets a secret 4-digit code. The goal? Be the first to guess your opponent's code based on logic and deduction. Think of it as a competitive twist on Wordle, but with numbers and real-time WebSocket action.

Live: [https://crackle-one.vercel.app](https://crackle-one.vercel.app)

---

## 🕹️ Gameplay

1. One player creates a room and shares the link.
2. Both players enter a secret 4-digit code.
3. Players take turns guessing each other's codes.
4. After each guess, a hint is given: how many digits are in the correct place.
5. First to guess the opponent's code wins!

---

## 📦 Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Go + Gin + WebSocket
- **Deployment**:
  - Frontend: Vercel
  - Backend: Fly.io

---

## 🧩 Project Structure

```
project-root/
├── backend/        # Go WebSocket server (Gin)
├── frontend/       # Next.js frontend app
└── fly.toml        # Fly.io backend config
```

---

## ☁️ Deployment

### Backend (Fly.io)

1. Install [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Launch app:

```bash
cd backend
fly launch
fly deploy
```

Set environment variable:

```bash
fly secrets set FRONTEND_URL=https://crackle-one.vercel.app
```

---

### Frontend (Vercel)

1. Deploy via [vercel.com](https://vercel.com)
2. Add these environment variables in Vercel Dashboard:

```env
NEXT_PUBLIC_BACKEND_URL_HTTP=https://<your-fly-app>.fly.dev
NEXT_PUBLIC_BACKEND_URL_WS=wss://<your-fly-app>.fly.dev
```

> Example: `crackle.fly.dev`

---

## 🧠 Features

- Realtime multiplayer with WebSocket
- Password-protected game rooms
- Game log with timestamped messages
- Clean dark-themed UI
- Reset & replay functionality

---

## 🛡️ License

MIT © 2025 [@andresidrim](https://github.com/andresidrim)
