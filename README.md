# Suyash's Website

A production-ready personal platform that is a living archive of who I am. Static about page paired with a dynamic semantic knowledge graph of my thoughts powered by embeddings.

---

## Stack

| Component      | Technology                                       |
| -------------- | ------------------------------------------------ |
| Frontend       | Next.js 15, React 19, TailwindCSS, Framer Motion |
| Backend        | Fastify, TypeScript, Zod                         |
| Database       | PostgreSQL 16 with pgvector                      |
| Search         | Embeddings + full-text search                    |
| Caching        | Redis                                            |
| Infrastructure | Docker, GitHub Actions, AWS                      |

---

## Core Features

**About Page**

- Static, beautifully designed intro with background, experience and interests

**Admin Panel**

- Custom JWT-based authentication
- Protected interface to create and edit entries

**Knowledge Graph Navigation**

- Search page where you enter a query
- Query takes you to the single most relevant entry
- At the bottom of each entry, two types of recommendations:
  - **Related to your query** - More entries matching your original search intent
  - **Related to this entry** - Entries semantically similar to what you're currently reading
- Click any recommendation to dive deeper, creating a choose-your-own-adventure through my thoughts
- Public access to navigate and explore

---

## Architecture

**Deployment:**

- Dockerized application
- AWS with RDS PostgreSQL, ElastiCache Redis
- Load balancer in front, secrets managed securely

**Application:**

- Separate frontend and backend (decoupled)
- Frontend calls backend API for all dynamic data
- Backend handles entries, auth, recommendations, embeddings, and caching

---

## Authentication

- Custom JWT-based auth
- Admin login page with email/password
- Protected admin routes for creating/editing entries
- JWT stored securely in httpOnly cookies

---

## Data Model

Entries with flexible content based on type. For example:

- **Song** (Spotify link, why it matters)
- **Photo** (image URL, context)
- **Writing** (text content, optional time period)
- **Podcast** (link, episode, your take)
- **Book** (title, author, your thoughts)
- **Place** (location, coordinates, why)
- **Thought** (just text)

Each entry gets an embedding vector for semantic search stored in PostgreSQL with pgvector.

---

## API Design

**Auth endpoints** for login/logout/verification

**Entry endpoints** for CRUD operations (admin protected for writes, public for reads)

**Query endpoint** - Takes natural language query, returns best matching entry

**Recommendation endpoints:**

- Get entries related to original query context
- Get entries related to current entry

**About endpoint** for static profile data

---

## Navigation Strategy

**How it works:**

- User enters query on search page
- Backend finds single best matching entry using hybrid search (semantic + full-text)
- Entry displays with two recommendation sections at bottom:
  - Entries similar to the original query (stay on theme)
  - Entries similar to current content (explore connections)
- Each click leads to new entry with its own dual recommendations
- Creates wandering exploration paths through the knowledge graph

---

## Embeddings Strategy

- Generate embedding once when entry is created or updated
- Store embedding vector in PostgreSQL (pgvector column)
- Cache embeddings in Redis for fast access
- Invalidate cache only when entry is updated
- Embedding model TBD (Cohere or OpenAI)

---

## Caching Strategy

**What gets cached:**

- Query-to-entry mappings (query → best entry)
- Related entries for each entry (precomputed similar entries)
- Query-based recommendations for common queries
- Entry embeddings for fast similarity calculations
- Frequently read entries

**Invalidation approach:**

- Entries rarely change after creation, so longer TTLs are fine
- Invalidate specific caches on entry updates/deletes
- Start simple with TTL-based expiration, optimize later

---

## Rate Limiting

**Key routes to protect:**

- Query endpoint (prevent embedding API abuse)
- Recommendation endpoints (reasonable limits)
- Login endpoint (prevent brute force)
- Public read endpoints (reasonable limits)

**Implementation:**

- Redis-based counters with appropriate time windows
- Return 429 when limits exceeded
- Admin routes have higher/no limits

---

## Implementation Roadmap

1. **Backend foundation** - Set up Fastify, PostgreSQL with pgvector, migrations
2. **Auth system** - JWT generation, login flow, protected route middleware
3. **Entry CRUD** - Basic create/read/update/delete with auth guards
4. **Embeddings** - Generate and store on write, set up caching
5. **Query & Recommendations** - Implement query-to-entry and dual recommendation logic
6. **Caching layer** - Add Redis caching for queries and recommendations
7. **Rate limiting** - Implement Redis-based rate limiting
8. **Frontend: About** - Build static landing page
9. **Frontend: Admin** - Build login and entry management UI
10. **Frontend: Knowledge Graph** - Build query input and dual recommendation navigation
11. **Dockerize** - Create containers and docker-compose setup
12. **CI/CD** - Set up GitHub Actions pipeline
13. **Deploy to AWS** - Configure ECS/EC2, RDS, ElastiCache, load balancing
