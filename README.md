# MiCinema

A full-stack cinema booking web application built with a modern monorepo architecture. The system covers the complete ticket purchasing lifecycle — from browsing films and selecting seats to payment processing, e-ticket generation, and staff check-in — alongside a back-office management dashboard.

## Features

**Customer**
- Browse movies by genre, status, and rating; view trailers and cast details
- Real-time seat map with a 10-minute reservation hold
- Secure checkout; membership tier discounts and loyalty point redemption applied at payment
- Food & Drink ordering linked to a booking
- E-ticket with per-seat QR codes displayed after payment confirmation
- Booking history and account profile showing membership tier, points balance, and tier progression

**Staff / Admin**
- Ticket check-in: enter any ticket code to retrieve the full booking — all seats and associated food orders — and check in seats individually
- Booking management with filtering by status, showtime, or customer; manual payment confirmation
- Showtime and room scheduling; movie and product catalog management
- Revenue and occupancy statistics dashboard

## Tech Stack

**Client** — React 19, TypeScript, Vite, Tailwind CSS v4, Mantine UI, TanStack Query, React Router v7, Zod, Axios

**Server** — Node.js, Express 5, TypeScript, MongoDB / Mongoose, JWT authentication, node-cron, Nodemailer, Multer

**Shared** — Common Zod schemas and TypeScript types consumed by both client and server via path aliases in a `shared/` package

## Project Structure

```
MiCinema/
├── client/     # React SPA
├── server/     # Express REST API
└── shared/     # Shared schemas, types, and constants
```

## Getting Started

**Prerequisites:** Node.js >= 20, MongoDB instance (local or Atlas), a `.env` file in `server/` with the required variables.

```bash
# Install root dependencies
npm install

# Server
cd server
npm install
npm run dev        # starts on http://localhost:5000

# Client (separate terminal)
cd client
npm install
npm run dev        # starts on http://localhost:5173
```

**Seed the database** (optional — creates demo data):

```bash
cd server
npm run seed
```

## API Overview

All endpoints are prefixed with `/api`.

| Resource | Prefix |
|---|---|
| Authentication | `/auth` |
| Movies | `/movies` |
| Cinemas & Rooms | `/cinemas`, `/rooms` |
| Showtimes | `/showtimes` |
| Bookings | `/booking` |
| Tickets | `/tickets` |
| Food & Orders | `/food` |
| Loyalty | `/loyalty` |
| Reviews | `/reviews` |
| Statistics | `/statistics` |
