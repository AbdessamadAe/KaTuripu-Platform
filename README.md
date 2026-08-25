<div align="center">
  <img src="public/images/logo.png" alt="KaTuripu logo" width="180" />
  <h1>KaTuripu</h1>
  <p><strong>Gamified learning roadmaps for Moroccan university admissions.</strong></p>
  <p>Explore a visual learning graph, master concepts through guided exercises, and track progress across an exam-preparation journey.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  </p>
</div>

![KaTuripu landing page](https://github.com/user-attachments/assets/adde95f9-3c07-4536-92d7-bfc42e7a1e95)

## The idea

Preparing for a competitive entrance exam is rarely just a list of chapters. Concepts depend on one another, progress is uneven, and students need a clear answer to: **what should I learn next?**

KaTuripu models an exam-preparation curriculum as a knowledge graph. Students choose a learning path, move through connected topics in the right order, practise each concept, and see their completion state directly on the roadmap. The platform is designed primarily for Moroccan students preparing for university admissions and entrance exams.

## Product tour

| Discover a learning path | Navigate the knowledge graph | Practise with guided exercises |
|---|---|---|
| ![Learning-path browser](https://github.com/user-attachments/assets/99be4550-bfaf-491c-9c3d-a12c39a3e44e) | ![Interactive knowledge-graph roadmap](https://github.com/user-attachments/assets/8b5b1e3e-3d48-4ac9-84de-21e2e9b79112) | ![Interactive exercise interface](https://github.com/user-attachments/assets/64a932f6-0415-4fcd-9f50-211bf24847a2) |

## Core experience

- **Interactive roadmaps:** connected course nodes make prerequisites and next steps visible
- **Learning-path discovery:** browse, search, sort, and filter roadmaps by duration and content
- **Guided practice:** multiple-choice exercises with hints, explanations, video support, and MathJax notation
- **Progress tracking:** persist exercise completion and show progress directly on roadmap nodes
- **Quizzes and difficulty levels:** organise assessment questions from easy to hard
- **Multilingual interface:** English, French, and Arabic translations through `next-intl`
- **Motivation mechanics:** completion states, achievements, progress indicators, and celebratory feedback
- **Admin tooling:** manage roadmap content and graph structure from protected administration routes
- **Responsive interface:** student flows work across desktop, tablet, and mobile layouts

## Learning model

```mermaid
flowchart LR
    A[Choose an admissions goal] --> B[Discover a learning path]
    B --> C[Follow connected roadmap nodes]
    C --> D[Complete exercises and quizzes]
    D --> E[Persist progress]
    E --> F[Unlock the next concepts]
    F --> C
```

The underlying data model reflects this flow: a `Roadmap` owns graph nodes and edges, nodes contain ordered exercises, and per-user records store exercise completion and quiz results.

## Architecture

```mermaid
flowchart LR
    A[Next.js App Router UI] --> B[Next.js API routes]
    B --> C[Prisma ORM]
    C --> D[(PostgreSQL)]
    A --> E[Clerk authentication]
    A --> F[next-intl translations]
    A --> G[React Query cache]
    A --> H[XY Flow roadmap canvas]
```

### Frontend

- Next.js 15 and React 19
- TypeScript and Tailwind CSS
- XY Flow for interactive roadmap graphs
- TanStack React Query for client-side server state
- `next-intl` for locale-aware routing and translations
- Framer Motion and canvas-confetti for interaction feedback
- MathJax for mathematical notation

### Backend

- Next.js API routes
- Prisma ORM with PostgreSQL
- Clerk authentication and webhook-based user synchronisation
- Role-aware user model with protected admin routes
- Docker Compose for the local PostgreSQL service

## Getting started

### Prerequisites

- Node.js 20+
- Docker with Docker Compose
- A Clerk application for authentication credentials

### 1. Install the project

```bash
git clone https://github.com/AbdessamadAe/KaTuripu-Platform.git
cd KaTuripu-Platform
npm install
```

### 2. Start PostgreSQL

```bash
docker compose -f docker/docker-compose.yml up -d
```

The included development configuration exposes PostgreSQL on port `5433` with database name `katuripu_db`.

### 3. Configure the environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5433/katuripu_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"
```

For automatic user synchronisation, configure a Clerk webhook targeting `/api/clerk-webhook` and subscribe it to the `user.created` and `user.updated` events.

### 4. Prepare and run the application

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Create the production build |
| `npm run start` | Run the production server |
| `npm run seed` | Seed the learning database |
| `npm run db` | Start an existing `katuripu_db` Docker container |
| `npm run lint` | Run the configured Next.js linter |

## Project structure

```text
messages/                  English, French, and Arabic translations
prisma/                    PostgreSQL schema, migrations, and seed data
public/images/             Product illustrations and brand assets
src/app/[locale]/          Localised pages and student flows
src/app/[locale]/admin/    Roadmap administration tools
src/app/api/               Backend endpoints and Clerk webhook
src/components/            Shared UI and learning components
src/services/              Data-access services
docker/                    Local PostgreSQL configuration
```

## Contributing

Issues, feature proposals, and pull requests are welcome. Start by reviewing the [open issues](https://github.com/AbdessamadAe/KaTuripu-Platform/issues) and keep changes focused on the admissions-preparation learning experience.

## Maintainer

KaTuripu is maintained by [Abdessamad Ait Elmouden](https://github.com/AbdessamadAe).
