# Turbo-Doc

**A Powerful Document & Image Conversion Platform**

Transform your documents and images with ease. Built with modern web technologies for speed, reliability, and scale.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)]()

## 🌐 Live Demo

- **Frontend**: [turbodoc.sharad.fun](https://turbodoc.sharad.fun)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

## 🚀 Overview

Turbo-Doc is a full-stack document and image conversion platform built with a modern monorepo architecture. It provides users with powerful file processing capabilities including format conversion, PDF merging/splitting, and image optimization with a beautiful, responsive UI.

### Key Highlights

- **Fast Processing**: Worker thread-based architecture for non-blocking file operations
- **Scalable**: Turborepo monorepo with shared packages and optimized builds
- **Secure**: Better Auth integration with social providers, file encryption, and secure S3 storage
- **Flexible**: Support for guest users and authenticated users with tiered subscription plans
- **Modern**: Built with Next.js 16, React 19, and the latest web technologies

## ✨ Features

### Document Processing

- **Format Conversion**: Convert between PDF, DOCX, TXT, PPT, XLSX formats
- **PDF Manipulation**: Merge multiple PDFs or split PDF by page range
- **Batch Processing**: Process multiple files simultaneously
- **Auto-expiration**: Automatic cleanup based on user plan retention period

### Image Operations

- **Format Conversion**: Convert between JPEG, PNG, WebP, AVIF, GIF
- **Compression**: Optimize image file size with quality controls
- **Resizing**: Scale images from 25% to 200% of original size
- **Dimension Detection**: Automatic width/height detection

### User Management

- **Authentication**: Email/password and social login (Google, GitHub) via Better Auth
- **Guest Access**: Limited daily conversions without account creation
- **Subscription Plans**: FREE and PRO tiers with varying limits
- **Usage Tracking**: Real-time monitoring of daily quotas

### Payment Integration

- **Razorpay**: Secure payment processing for PRO subscriptions
- **Webhooks**: Automated subscription management
- **Invoice Generation**: Transaction history and receipts

## 🛠 Tech Stack

### Monorepo

- **[Turborepo](https://turbo.build/)** - High-performance build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

### Frontend (`apps/web`)

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Premium component library
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Zod](https://zod.dev/)** - Schema validation

### Backend (`apps/api`)

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Piscina](https://github.com/piscinajs/piscina)** - Worker thread pool for CPU-intensive operations
- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution
- **[tsup](https://tsup.egoist.dev/)** - TypeScript bundler

### Database & ORM

- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[Prisma Adapter (pg)](https://www.prisma.io/docs/orm/overview/databases/postgresql)** - PostgreSQL adapter

### Authentication

- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library
- **OAuth Providers**: Google, GitHub
- **Session Management**: Cookie-based with cross-subdomain support

### File Processing

- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing
- **[LibreOffice](https://www.libreoffice.org/)** - Document format conversion (headless)
- **[PDF-lib](https://pdf-lib.js.org/)** - PDF manipulation

### Storage & CDN

- **[AWS S3](https://aws.amazon.com/s3/)** - Object storage
- **[AWS CloudFront](https://aws.amazon.com/cloudfront/)** - Content delivery network
- **Presigned URLs**: Secure file upload/download

### Payment

- **[Razorpay](https://razorpay.com/)** - Payment gateway (India)
- **Webhook Integration**: Automated subscription updates

### Developer Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[tsx](https://github.com/privatenumber/tsx)** - Development server

## 📁 Project Structure

```
Turbo-Doc/
├── apps/
│   ├── api/                    # Express.js backend API
│   │   ├── src/
│   │   │   ├── controllers/   # Route controllers
│   │   │   ├── middleware/    # Auth, limits, storage checks
│   │   │   ├── routes/        # API routes
│   │   │   ├── services/      # Business logic
│   │   │   ├── workers/       # Piscina worker threads
│   │   │   └── utils/         # Helper functions
│   │   └── package.json
│   │
│   └── web/                   # Next.js frontend
│       ├── src/
│       │   ├── app/           # App router pages
│       │   ├── components/    # React components
│       │   ├── views/         # Page views
│       │   ├── api/           # API clients
│       │   ├── lib/           # Utilities
│       │   └── providers/     # Context providers
│       └── package.json
│
├── packages/
│   ├── auth/                  # Better Auth configuration
│   ├── database/              # Prisma schema & client
│   │   └── prisma/
│   │       ├── schema.prisma # Database model
│   │       └── seed.ts       # Seed script
│   ├── file-upload/           # AWS S3 utilities
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   ├── zod-schemas/           # Shared validation schemas
│   └── config/                # Shared configuration
│       ├── eslint-config/
│       ├── tailwind-config/
│       └── typescript-config/
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # pnpm workspace definition
├── turbo.json                 # Turborepo pipeline config
└── README.md
```

## 🏁 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.0.0
- **PostgreSQL** database
- **AWS S3** bucket and credentials
- **Razorpay** account (for payments)
- **LibreOffice** installed (for document conversion)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sharad-77/Turbo-Doc.git
   cd Turbo-Doc
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/turbodoc"

   # API Configuration
   API_PORT=3001
   API_URL="http://localhost:3001"
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3001"

   # OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_S3_REGION="your-aws-region"
   AWS_BUCKET_NAME="your-bucket-name"
   AWS_CLOUDFRONT_URL="https://your-cloudfront-url"

   # Razorpay
   TEST_API_KEY="your-razorpay-key"
   TEST_API_SECRET="your-razorpay-secret"
   TEST_API_WEBHOOK_SECRET="your-webhook-secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
   ```

4. **Generate Prisma Client & Run Migrations**

   ```bash
   cd packages/database
   pnpm db:generate
   pnpm db:push
   pnpm db:seed    # Seed subscription plans
   cd ../..
   ```

5. **Build packages**

   ```bash
   pnpm build
   ```

6. **Start development servers**

   ```bash
   pnpm dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

## 📜 Available Scripts

From the root directory:

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm dev --filter=web # Start only frontend
pnpm dev --filter=api # Start only backend

# Building
pnpm build            # Build all apps
pnpm build --filter=web

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm types            # TypeScript type checking
pnpm check            # Run format + lint + types

# Database
cd packages/database
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database
```

## 🚢 Deployment

### Frontend (Vercel)

The frontend is deployed on [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/web`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
4. Deploy!

### Backend (AWS EC2)

The backend is deployed on AWS EC2:

1. **Launch EC2 Instance** (Ubuntu 22.04, t3.micro or larger)

2. **Install Dependencies**

   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql-client libreoffice
   npm install -g pnpm pm2
   ```

3. **Clone & Build**

   ```bash
   git clone https://github.com/sharad-77/Turbo-Doc.git
   cd Turbo-Doc
   pnpm install --frozen-lockfile
   pnpm build --filter=api
   ```

4. **Configure Environment**
   - Copy `.env` file with production values
   - Ensure `NODE_ENV=production`

5. **Start with PM2**

   ```bash
   pm2 start apps/api/dist/index.js --name turbodoc-api
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx (Optional)**
   Configure Nginx as a reverse proxy with SSL termination

### Database (PostgreSQL)

Hosted on a managed PostgreSQL service (e.g., AWS RDS, Neon, Supabase):

1. Create database instance
2. Configure connection string in `.env`
3. Run migrations: `pnpm db:push`
4. Seed initial data: `pnpm db:seed`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sharad**

- GitHub: [@sharad-77](https://github.com/sharad-77)

---

**Built with ❤️ using modern web technologies**
