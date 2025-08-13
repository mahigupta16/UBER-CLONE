# Uber-Style Ride Hailing App (React + Node.js)

A full‑stack ride hailing platform with real‑time tracking, OTP‑secured trip start, and synchronized rider/captain experiences. Built as a learning‑grade clone to demonstrate modern front‑end UX and scalable back‑end patterns.

## Features
- Live map tracking (Leaflet + React‑Leaflet) with pickup, destination, and optional multi‑stops
- Ride lifecycle over Socket.IO: request → accept → waiting → start (OTP) → in‑ride; cancel events handled bi‑directionally
- OTP‑gated "Start Ride" flow to prevent fraudulent trip initiation
- Smooth panel transitions and micro‑interactions powered by GSAP; non‑disruptive UI that preserves layout
- Fare computation wired to distance/duration and vehicle type on backend
- Auth for Users and Captains with JWT; protected REST endpoints and profile retrieval

## Tech Stack
- Frontend: React (Vite), React Router, Tailwind CSS, GSAP, Leaflet, React‑Leaflet, Socket.IO client, Axios
- Backend: Node.js, Express 5, Socket.IO, MongoDB + Mongoose, JWT, bcrypt, Express‑Validator, CORS, dotenv

## Monorepo Structure
- /frontend – React client (Vite)
- /Backend – Node/Express API + Socket.IO

## Getting Started
### Prerequisites
- Node.js 18+ and npm
- MongoDB connection URI

### 1) Install dependencies
```bash
# In /Backend
cd Backend
npm install

# In /frontend
cd ../frontend
npm install
```

### 2) Environment variables
Create Backend/.env:
```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Create frontend/.env:
```bash
VITE_BASE_URL=http://localhost:3000
```

### 3) Run locally
Open two terminals.
```bash
# Terminal 1: backend
cd Backend
npm run dev

# Terminal 2: frontend
cd frontend
npm run dev
```
- Frontend default: http://localhost:5173
- Backend default: http://localhost:3000 (or PORT specified)

## Key Flows
- User requests a ride; backend computes fare and issues OTP
- Captains receive ride request via Socket.IO; on accept, user is notified in real time
- Ride start requires OTP verification; on success, both clients transition to in‑ride state
- Cancellation emits socket events to keep both sides synchronized

## Notable Components & Files
- frontend/src/components/ConfirmRidePopUp.jsx – OTP entry + ride start
- frontend/src/pages/Home.jsx – ride request, socket listeners (ride‑confirmed/started)
- frontend/src/pages/CaptainHome.jsx – accept/confirm ride, cancel broadcast
- frontend/src/components/LiveTracking.jsx – map rendering and live tracking
- Backend/services/rideServices.js – fare, ride creation, confirm ride, OTP handling

## Scripts
- frontend: `npm run dev`, `npm run build`, `npm run preview`
- Backend: `npm run dev`

## Disclaimer
This project is a learning clone; not intended for production use without additional hardening (security, rate limiting, testing, CI/CD, observability).

