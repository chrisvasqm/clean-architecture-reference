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
   - Implements domain repository interfaces (`InMemoryProductRepository`).
   - Can easily be swapped out for PostgreSQL, SQLite, Prisma, or MongoDB without changing any business logic.
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
- **Swappable Infrastructure**: Changing from In-Memory storage to Prisma/PostgreSQL only requires writing a new class implementing `IProductRepository` and plugging it into `src/index.ts`.
- **Fast Build and Dev Workflow**: Instant startup and hot reloading with `tsx`, sub-millisecond production bundles with `esbuild`.
