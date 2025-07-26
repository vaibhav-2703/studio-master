# SnipURL - URL Shortener

SnipURL is a modern URL shortener application built with Next.js. Create, share, and track short links with custom aliases, analytics, and more.

## Features

- **Short Links:** Create memorable links with custom aliases
- **Analytics Dashboard:** Track link performance and user engagement
- **QR Code Generation:** Generate QR codes for easy sharing
- **Click Tracking:** Detailed analytics with country-based insights
- **Custom Aliases:** Create branded short links
- **Theme Support:** Light and dark mode
- **Security:** URL validation and safety checks
- **Responsive Design:** Modern UI that works on all devices

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** JSON file storage
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

The application will be running inside Docker and accessible at [http://localhost:3000](http://localhost:3000).

---

## Data Storage

This app does **not** use Firebase, Firestore, or any Google backend for data storage. All data is stored locally in a JSON file (`src/lib/db.json`). No Firebase emulators or configuration are required for development or production.

---
