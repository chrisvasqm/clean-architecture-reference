# Clean Architecture Reference (Node.js + Express + TypeScript)

A pragmatic, simplified reference implementation of **Clean Architecture** using Node.js, Express, TypeScript, [tsx](https://github.com/privatenumber/tsx), and [esbuild](https://esbuild.github.io/) managed with `pnpm`.

This project demonstrates how to structure a real-world CRUD application following Clean Architecture principles without over-engineering, unnecessary boilerplate, or heavyweight DI frameworks.

---

## Requirements

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run in Development Mode

Starts the server with hot-reloading via `tsx`:

```bash
pnpm dev
```

The server will be available at `http://localhost:3000`.

### 3. Run Test Suite

Runs the automated test suite with Vitest and Supertest covering all CRUD endpoints, domain validations, and error handling:

```bash
pnpm test
# or in watch mode
pnpm run test:watch
```

### 4. Typecheck and Build

Verifies types and bundles an optimized ESM production artifact using `esbuild`:

```bash
pnpm run typecheck
pnpm run build
pnpm start
```

### 5. Run with PostgreSQL & Docker Compose

Start the PostgreSQL container:

```bash
docker compose up -d
```

Push the Drizzle schema to the database:

```bash
pnpm run database:push
```

Run the application connected to PostgreSQL:

```bash
DATABASE_URL="postgres://postgres:postgrespassword@localhost:5432/products_db" pnpm dev
```

Inspect the database in Drizzle Studio:

```bash
pnpm run database:studio
```

---

## Architecture Overview

The system strictly adheres to the **Dependency Rule**: *dependencies only point inward*. Inner layers know nothing about outer layers.

```
       ┌────────────────────────────────────────────────────────┐
       │ Presentation Layer (Express HTTP, Controllers, Routes) │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │ Application Layer (Use Cases: Create, List, Get, etc.) │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │ Domain Layer (Entities, Errors, Repository Interfaces) │
       └───────────────────────────▲────────────────────────────┘
                                   │
       ┌───────────────────────────┴────────────────────────────┐
       │ Infrastructure Layer (In-Memory Repository / DB)       │
       └────────────────────────────────────────────────────────┘
```

### The 4 Layers (The Simple Way)

1. **Domain Layer (`src/domain/`)**
   - Pure business logic, entities, and domain errors.
   - Zero framework dependencies (no Express, no ORMs).
   - Contains repository interfaces (`IProductRepository`) defining persistence contracts.
2. **Application Layer (`src/application/`)**
   - Focused use cases (`CreateProductUseCase`, `GetProductUseCase`, `ListProductsUseCase`, `UpdateProductUseCase`, `DeleteProductUseCase`).
   - Orchestrates entities and domain repository contracts.
3. **Infrastructure Layer (`src/infrastructure/`)**
   - Implements domain repository interfaces (`InMemoryProductRepository`, `PostgresProductRepository`).
   - Connects to PostgreSQL using Drizzle ORM and `pg` (`node-postgres`) with connection pooling.
   - Can easily be swapped out without changing any application or domain logic.
4. **Presentation Layer (`src/presentation/`)**
   - HTTP transport using Express single-action controllers (`CreateProductController`, `GetProductController`, etc.) and `createProductRouter`.
   - Centralized error handler mapping domain errors (`NotFoundError`, `ValidationError`, `ConflictError`) to appropriate HTTP status codes (404, 400, 409).
5. **Composition Root (`src/index.ts`)**
   - Manual, lightweight dependency injection (constructor injection). No reflection or bulky DI containers needed.
   - Wires up the repository, use cases, controller, and Express server in one readable place.

---

## Why This Approach?

- **Zero Over-Engineering**: Avoids cumbersome Java-style abstractions or boilerplate decorators while maintaining clear boundaries.
- **Testable**: Use cases and domain entities can be unit tested without starting an HTTP server or connecting to a database.
- **Swappable Infrastructure**: Changing from In-Memory storage to PostgreSQL (via Drizzle ORM) only requires swapping the repository implementation in `src/index.ts` without touching use cases or entities.
- **Fast Build and Dev Workflow**: Instant startup and hot reloading with `tsx`, sub-millisecond production bundles with `esbuild`.
