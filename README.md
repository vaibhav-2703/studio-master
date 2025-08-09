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
- **Authentication:** Custom JWT (httpOnly cookie) auth (email + password) implemented in `src/lib/auth.ts` with secure token issuance and validation.
- **Database:** File-based JSON storage
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

This app does **not** use Firebase, Firestore, or any Google backend for data storage. All data is stored locally in a JSON file (`src/lib/db.json`). No Firebase emulators or configuration are required for development or production.

---
