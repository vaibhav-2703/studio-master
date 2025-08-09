# LinkCraft - Modern URL Shortener

LinkCraft is a modern, full-stack URL shortener application built with Next.js. It allows users to create, share, and track short links with features like custom aliases, QR code generation, and detailed analytics.

## Features

- **Powerful Short Links:** Create short, memorable links with random or custom aliases.
- **Link Analytics:** A comprehensive dashboard to track link performance, including total clicks and click trends.
- **Customizable QR Codes:** Generate and customize QR codes for your short links with different colors.
- **Analytics:** Track clicks, and user engagement.
- **Custom Aliases:** Create memorable short links.
- **QR Codes:** Generate QR codes for easy sharing.
- **Theme Support:** Light and dark mode support.
- **Security:** Basic URL validation and safety checks.
- **Responsive Design:** A beautiful, modern UI that works on all devices.
- **Light & Dark Mode:** Switch between light and dark themes.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Authentication:** Short-lived access token + rotating refresh token (httpOnly, sameSite=strict) in `src/lib/auth.ts`.
- **Database:** PostgreSQL via Prisma (`prisma/schema.prisma`).
- **Deployment:** [Vercel](https://vercel.com/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)

### 1. Set Up Environment Variables

This project uses the free [PhishTank API](https://phishtank.com/developer_info.php) to check for phishing and malicious URLs. No API key or special setup is required for this feature.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for potential errors.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.


## Docker Deployment

A multi-stage `Dockerfile` is included for creating a production-optimized Docker image.

1.  **Build the Docker image:**

    ```bash
    docker build -t linkcraft-app .
    ```

2.  **Run the Docker container:**

    ```bash
    docker run -p 3000:3000 --env-file .env linkcraft-app
    ```

    > **Note:** The `--env-file .env` flag injects your environment variables (like the Safe Browsing API key) into the container at runtime.

The application will be running inside Docker and accessible at [http://localhost:3000](http://localhost:3000).

---

## Data Storage

- Replaced legacy JSON file with PostgreSQL + Prisma. Migrations live in `prisma/migrations` and run automatically during build (`prisma migrate deploy`).

## CI/CD & Deployment

### Vercel Auto Deploy
Pushes to `main` (or `master`) trigger Vercel's native build & deploy. Configure environment variables in Vercel for Development, Preview, and Production:

Required:
- DATABASE_URL
- JWT_SECRET
- PASSWORD_PEPPER (optional but recommended)
- JWT_ACCESS_EXPIRES_IN (e.g. 15m)
- REFRESH_TOKEN_DAYS (e.g. 30)

### GitHub Actions Quality Gate
Workflow `.github/workflows/ci.yml` validates build, type checking, linting. Deployment itself is handled by Vercel (no manual deploy step in the workflow).

### Migrations
`prisma migrate deploy` runs during the build. Always commit new migrations. Avoid editing past migrations; create incremental ones.

### Local Development
Set `DATABASE_URL` in `.env` (see `.env.example`). Run:

```bash
npm install
npm run dev
```

### Refresh Tokens
Refresh tokens are stored hashed in the `RefreshToken` table; rotation endpoint: `POST /api/auth/refresh`.
