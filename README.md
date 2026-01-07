# Personal Website

A semantic knowledge graph of my thoughts, powered by AI embeddings. Search through ideas and explore connections through natural language.

**🔗 Live Site**: [suyashgoel.com](https://suyashgoel.com)

---

## Overview

This is my personal website featuring a dynamic knowledge graph built on vector similarity search. Users can search through my entries using natural language queries and navigate through related content via dual recommendation systems.

**Key Features:**

- **Semantic Search**: Natural language queries powered by OpenAI embeddings (3072-dimensional vectors)
- **Knowledge Graph Navigation**: Dual recommendations—entries similar to your query and entries similar to current content
- **Vector Similarity**: PostgreSQL with pgvector extension for fast cosine similarity search
- **Intelligent Caching**: Redis-backed caching with pattern-based invalidation
- **Admin Panel**: Protected content management system with JWT authentication

---

## Tech Stack

**Frontend**

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Jotai (state management)
- React Query (data fetching)

**Backend**

- Fastify
- PostgreSQL 16 with pgvector
- Redis
- OpenAI Embeddings API
- Prisma ORM
- TypeScript

**Infrastructure**

- Vercel (frontend)
- Render (backend)
- AWS S3 (image storage)
- Docker (local development)

---

## Architecture

### Semantic Search Flow

1. User submits natural language query
2. Generate embedding vector using OpenAI's `text-embedding-3-large`
3. Perform cosine similarity search against stored entry embeddings in PostgreSQL
4. Return top match and related recommendations

### Dual Recommendation System

Each entry displays two types of recommendations:

- **Query-based**: Entries similar to the user's original search intent
- **Content-based**: Entries semantically similar to the current entry

This creates a "choose your own adventure" navigation through the knowledge graph.

### Caching Strategy

- Entry embeddings: 24 hour TTL
- Query results: 15 minute TTL
- Recommendations: 15 minute TTL
- Pattern-based invalidation on content updates

### Security

- JWT authentication with httpOnly signed cookies
- bcrypt password hashing (12 rounds)
- Redis-backed rate limiting
- Zod schema validation across the stack
- CORS configured for credentials

---

## Project Structure

```
personal-website/
├── apps/
│   ├── api/              # Fastify backend
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── clients/     # DB, Redis, OpenAI, S3
│   │   │   └── utils/       # Helpers, caching
│   │   └── prisma/          # Schema & migrations
│   └── web/              # Next.js frontend
│       └── src/
│           ├── app/         # Routes (App Router)
│           │   ├── (public)/   # Public pages
│           │   └── (admin)/    # Protected admin
│           ├── components/  # React components
│           └── lib/         # API client, hooks
└── packages/
    └── shared/           # Zod schemas & types
```

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10.17.0+
- Docker & Docker Compose
- OpenAI API key
- AWS S3 bucket (for image storage)

### Setup

**1. Clone and install dependencies**

```bash
git clone https://github.com/suyashgoel/personal-website.git
cd personal-website
pnpm install
```

**2. Start infrastructure services**

```bash
cd apps/api
pnpm db:up
```

This starts PostgreSQL (with pgvector) and Redis via Docker Compose.

**3. Configure environment variables**

**Backend** (`apps/api/.env`):

```bash
# Copy example file
cp .env.example .env

# Configure required variables:
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug

# Database (uses docker-compose values)
DATABASE_URL=postgresql://admin:password@localhost:5432/suyash_db

# Redis (uses docker-compose values)
REDIS_URL=redis://localhost:6379

# Authentication (generate secure random strings)
JWT_SECRET=your-secret-at-least-32-characters-long
COOKIE_SECRET=your-secret-at-least-32-characters-long

# OpenAI
OPENAI_KEY=sk-your-openai-api-key

# AWS S3
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name

# URLs
FRONTEND_URL=http://localhost:3000

# Admin user (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
```

**Frontend** (`apps/web/.env.local`):

```bash
# Copy example file
cp .env.local.example .env.local

# Configure API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**4. Run database migrations**

```bash
cd apps/api
pnpm db:migrate
```

**5. Seed admin user**

```bash
pnpm db:seed:admin
```

**6. Start development servers**

```bash
# From project root
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Health: http://localhost:8080/health

---

## API Endpoints

### Public

- `GET /health` - Health check
- `GET /entries` - List all entries
- `GET /entries/:slug` - Get entry by slug
- `GET /recommendations?query=...` - Query-based recommendations
- `GET /recommendations?slug=...&excludeSlugs=...` - Entry-based recommendations
- `GET /about` - Get about page content

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Protected (Admin only)

- `POST /entries` - Create entry with image upload
- `PUT /entries/:slug` - Update entry
- `DELETE /entries/:slug` - Delete entry

---

## Development Commands

```bash
# Root workspace
pnpm dev          # Start all apps in parallel
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting

# API-specific (from apps/api)
pnpm dev          # Start API in watch mode
pnpm build        # Build for production
pnpm start        # Run production build
pnpm db:up        # Start Docker services
pnpm db:down      # Stop Docker services
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:seed:admin # Seed admin user

# Web-specific (from apps/web)
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Run production build
```

---

## Deployment

**Frontend**: Deployed on Vercel with automatic deployments from `main` branch

**Backend**: Deployed on Render with managed PostgreSQL and Redis instances

**Environment Configuration**: All production environment variables are set via hosting platform dashboards

---

## Technical Highlights

### Monorepo Architecture

- Workspace managed with pnpm
- Shared TypeScript types and Zod schemas
- Consistent tooling across frontend and backend

### Type Safety

- End-to-end type safety with TypeScript
- Zod schemas shared between client and server
- Fastify type provider for validated routes
- Prisma for type-safe database queries

### Performance

- React Query for optimized data fetching
- Redis caching with smart invalidation
- PostgreSQL indexes on vector columns
- Next.js App Router with Server Components

### Developer Experience

- Hot reload in development
- Docker Compose for local services
- Prisma Studio for database exploration
- ESLint + Prettier for code consistency
- GitHub Actions CI pipeline

---

## License

MIT

---

## Contact

Built by Suyash Goel

- Website: [suyashgoel.com](https://suyashgoel.com)
- GitHub: [suyashgoel](https://github.com/suyashgoel)
- LinkedIn: [suyash-goel](https://linkedin.com/in/suyash-goel/)

---

**Questions or feedback?** Feel free to reach out via the contact information on my website.
