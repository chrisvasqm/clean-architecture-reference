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
   - HTTP transport using Express (`ProductController`, `createProductRouter`).
   - Centralized error handler mapping domain errors (`NotFoundError`, `ValidationError`, `ConflictError`) to appropriate HTTP status codes (404, 400, 409).
5. **Composition Root (`src/index.ts`)**
   - Manual, lightweight dependency injection (constructor injection). No reflection or bulky DI containers needed.
   - Wires up the repository, use cases, controller, and Express server in one readable place.

---

## API Reference and Sample Requests

### 1. Health Check
```bash
curl http://localhost:3000/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-10-26T09:27:27.850Z"
}
```

---

### 2. List All Products
```bash
curl http://localhost:3000/api/products
```
**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Mechanical Keyboard",
      "description": "Hot-swappable mechanical keyboard with RGB backlighting",
      "price": 99.99,
      "stock": 25,
      "createdAt": "2026-10-26T09:25:00.000Z",
      "updatedAt": "2026-10-26T09:25:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3. Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "4K Gaming Monitor",
    "description": "27-inch 144Hz IPS display",
    "price": 349.99,
    "stock": 12
  }'
```
**Response (201 Created):**
```json
{
  "data": {
    "id": "892a0e2d-e215-4bfb-b467-f31f9b3ec4a1",
    "name": "4K Gaming Monitor",
    "description": "27-inch 144Hz IPS display",
    "price": 349.99,
    "stock": 12,
    "createdAt": "2026-10-26T09:26:00.000Z",
    "updatedAt": "2026-10-26T09:26:00.000Z"
  },
  "message": "Product created successfully"
}
```

---

### 4. Get Product by ID
```bash
curl http://localhost:3000/api/products/1
```
**Response (200 OK):**
```json
{
  "data": {
    "id": "1",
    "name": "Mechanical Keyboard",
    "description": "Hot-swappable mechanical keyboard with RGB backlighting",
    "price": 99.99,
    "stock": 25,
    "createdAt": "2026-10-26T09:25:00.000Z",
    "updatedAt": "2026-10-26T09:25:00.000Z"
  }
}
```

---

### 5. Update a Product
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 89.99,
    "stock": 30
  }'
```
**Response (200 OK):**
```json
{
  "data": {
    "id": "1",
    "name": "Mechanical Keyboard",
    "description": "Hot-swappable mechanical keyboard with RGB backlighting",
    "price": 89.99,
    "stock": 30,
    "createdAt": "2026-10-26T09:25:00.000Z",
    "updatedAt": "2026-10-26T09:27:00.000Z"
  },
  "message": "Product updated successfully"
}
```

---

### 6. Delete a Product
```bash
curl -X DELETE http://localhost:3000/api/products/1
```
**Response (200 OK):**
```json
{
  "message": "Product with id \"1\" was deleted successfully"
}
```

---

### 7. Error Handling Examples
When validation fails:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "", "price": -10}'
```
**Response (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "message": "Product name is required."
}
```

When requesting a nonexistent ID:
```bash
curl http://localhost:3000/api/products/unknown-id
```
**Response (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Product with id \"unknown-id\" was not found."
}
```

---

## Why This Approach?

- **Zero Over-Engineering**: Avoids cumbersome Java-style abstractions or boilerplate decorators while maintaining clear boundaries.
- **Testable**: Use cases and domain entities can be unit tested without starting an HTTP server or connecting to a database.
- **Swappable Infrastructure**: Changing from In-Memory storage to Prisma/PostgreSQL only requires writing a new class implementing `IProductRepository` and plugging it into `src/index.ts`.
- **Fast Build and Dev Workflow**: Instant startup and hot reloading with `tsx`, sub-millisecond production bundles with `esbuild`.
