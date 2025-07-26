# Next.js - Auth.js - OAuth Authentication Boilerplate

A production-ready Next.js authentication boilerplate with **Google OAuth**, **Neon Database**, **Auth.js**, and **Sentry** integration. Supports **Edge**, Server, and Client environments. [see version below](#Dependencies).

## ✨ Features

- 🔑 **Google OAuth 2.0** - Complete authentication flow with refresh tokens
- 🗄️ **Neon Database** - Serverless PostgreSQL with edge compatibility
- 🚀 **Auth.js v5** - Latest authentication for Next.js
- 📊 **Sentry Integration** - Error monitoring across all environments
- 🔒 **Secure Session Management** - JWT-based with automatic token refresh
- 🌐 **Multi-Environment Support** - Edge, Server, and Client runtime optimization
- 🛡️ **Route Protection** - Middleware-based authentication guards

## 🏗️ Architecture Overview

### Runtime Environments

| Environment   | Location                                  | Purpose                                          |
| ------------- | ----------------------------------------- | ------------------------------------------------ |
| **🖥️ Server** | `src/app/api/auth/[...nextauth]/route.ts` | Auth.js API routes                               |
| **⚡ Edge**   | `src/middleware.ts`                       | Route protection & redirects                     |
| **💻 Client** | `src/app/page.tsx`                        | UI components & user interaction                 |
| **🔄 Hybrid** | `auth.ts`                                 | Auth configuration (works in both server & edge) |

### Database Architecture

- **Neon Database** - Serverless PostgreSQL
- **Prisma ORM** - Type-safe database queries
- **Neon Adapter** - Edge-compatible database connections
- **Connection Pooling** - Optimized for serverless environments

## 🚀 Quick Start

### Environment Setup

Copy `.env.example` to `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
AUTH_SECRET="your-auth-secret-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Sentry (Optional)
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

## 📁 Project Structure

oauth_kickstarter/

├── 📄 auth.ts # Auth.js configuration (Hybrid)

├── 📄 prisma.ts # Database client (Edge/Server)

├── 📄 next.config.ts # Next.js configuration

├── 🛠 sentry.config.ts # Sentry configurations

├── 🗂 prisma/

│ ├── 📄 schema.prisma # Database schema

│ └── 📁 migrations/ # Database migrations

├── 📁 src/

│ ├── 📁 app/ # Next.js App Router

│ │ ├── 🛠 api/auth/ # Auth API routes (Server)

│ │ ├── 🛠 auth/error/ # Error pages (Client)

│ │ ├── 🛠 authenticated/ # Protected pages (Server)

│ │ └── 🛠 page.tsx # Home page (Client)

│ ├── 📁 lib/ # Configuration files

│ ├── 📁 middleware/ # Route protection (Edge)

│ ├── 📁 types/ # TypeScript definitions

│ └── 📁 utils/ # Utility functions

## Dependencies

The project leverages the following dependencies as defined in `package.json`:

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.10.0",
    "@neondatabase/serverless": "^1.0.1",
    "@prisma/adapter-neon": "^6.12.0",
    "@prisma/client": "^6.11.1",
    "@sentry/nextjs": "^9.40.0",
    "next": "15.3.5",
    "next-auth": "^5.0.0-beta.29",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ws": "^8.18.3"
  }
}
```
