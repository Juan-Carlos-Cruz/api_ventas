# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Sales Platform** for Cutit Saws Ltd consisting of three microservices:
- **Backend** (sales-api): Express.js + TypeScript + Prisma ORM + PostgreSQL
- **Frontend** (sales-dashboard): React + TypeScript + Vite + TailwindCSS
- **Inventory API** (inventory-api): Express.js mock service for product inventory and reservations

The system manages sales, customers, product reservations, and integrates with external inventory and dispatch services.

## Development Commands

### Full Stack (Docker Compose - Recommended)
```bash
# Start all services (backend, frontend, postgres, inventory-api)
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f [service-name]
```

### Backend (sales-api)
```bash
cd backend

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start

# Prisma commands
npx prisma migrate dev          # Create and apply migrations
npx prisma generate             # Generate Prisma Client
npx prisma studio               # Open Prisma Studio GUI
npx prisma db push              # Push schema changes without migrations
```

### Frontend (sales-dashboard)
```bash
cd frontend

# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm preview
```

### Inventory API (Mock Service)
```bash
cd inventory-api

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## Architecture

### Service Communication
- **Frontend → Backend**: HTTP requests to `http://localhost:3000/api/sales`
- **Backend → Inventory API**: HTTP requests to `http://localhost:3001/api/v1` (configured via `INVENTORY_API_URL`)
- **Backend → Postgres**: Prisma ORM connection via `DATABASE_URL`
- **Backend → Dispatch API**: Placeholder integration via `DISPATCH_API_URL` (not implemented)

### Database Schema (Prisma)
Located in `backend/prisma/schema.prisma`:
- **Customer**: id, name, email, address
- **Sale**: id, customerId, total, status (PENDING|COMPLETED|SHIPPED|CANCELLED), deliveryMethod (PICKUP|DISPATCH), dispatchId
- **SaleItem**: id, saleId, productId, quantity, unitPrice

The backend does NOT store product details - it only stores `productId` references. Product data is fetched from the Inventory API.

### Frontend Structure
- **Pages**: `Dashboard.tsx` (sales overview), `NewSale.tsx` (create new sale)
- **Components**:
  - `layout/`: Layout wrapper and Navbar
  - `sales/`: ProductCard, Cart, CartItem, ProductSearch
  - `ui/`: Reusable UI components (Card, Badge, Button, Input)
- **Services**: `api.ts` handles HTTP requests to backend
- **Routing**: React Router with `/` (dashboard) and `/nueva-venta` (new sale)

### Inventory API Integration
The inventory-api mock provides:
- Product search and retrieval
- Stock availability checking (types: STOCK, MANUFACTURING, MADE_TO_ORDER)
- Reservation system (15-minute temporary holds)
- Reservation confirmation/release

**Key endpoints:**
- `GET /api/v1/products/search?query={term}&limit={n}&offset={n}`
- `GET /api/v1/products/:productId`
- `GET /api/v1/products/:productId/availability`
- `POST /api/v1/reservations` (create reservation)
- `POST /api/v1/reservations/:id/confirm` (confirm and deduct stock)
- `DELETE /api/v1/reservations/:id` (release reservation)

Reservations expire automatically after 15 minutes and are cleaned up every 60 seconds.

## Environment Configuration

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sales_db?schema=public"
PORT=3000
INVENTORY_API_URL="http://localhost:3001"
DISPATCH_API_URL="http://localhost:3002"
```

### Docker Compose
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Postgres: `localhost:5433` (mapped from container port 5432)
- Inventory API: `http://localhost:3001`

## Deployment Options

### Option 1: Docker Compose (Simple)
```bash
docker compose up -d --build
```
Access: Backend at :3000, Frontend at :5173

### Option 2: Kubernetes (Scalable)
Uses manifests in `k8s/` directory. Requires Minikube or similar.

**Build images:**
```bash
eval $(minikube docker-env)
docker build -t sales-backend:latest ./backend
docker build -t sales-frontend:latest ./frontend
docker build -t tailscale-gateway:with-socat -f ./k8s/Dockerfile.tailscale ./k8s
```

**Deploy:**
```bash
kubectl create namespace sales-platform
kubectl apply -f k8s/tailscale-auth.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/tailscale-gateway.yaml
```

See `deployment_guide.md` for complete deployment instructions.

## Key Technical Details

### Prisma Configuration
- Uses `binaryTargets = ["debian-openssl-3.0.x"]` for Docker compatibility
- Database migrations are in `backend/prisma/migrations/`
- Always run `npx prisma generate` after schema changes

### Frontend Build
- Vite dev server runs on port 5173
- Production builds are served via nginx in Docker (port 80, mapped to 5173)
- TailwindCSS is configured with custom utility classes in `lib/utils.ts`

### API Routes
Backend exposes:
- `POST /api/sales` - Create new sale
- `GET /api/sales` - List all sales
- `GET /api/sales/:id` - Get single sale
- `GET /api/sales/products` - Proxy to inventory API for product search

### TypeScript Configuration
- Backend: Uses `ts-node` for development, compiles to `dist/` for production
- Frontend: Uses Vite's built-in TypeScript support
- Shared types are defined in `frontend/src/types.ts` and backend controllers

## Common Development Patterns

### Adding a New Sale Endpoint
1. Define route in `backend/src/routes/salesRoutes.ts`
2. Implement controller in `backend/src/controllers/salesController.ts`
3. Update Prisma schema if database changes are needed
4. Run `npx prisma migrate dev --name migration_name`
5. Update frontend service in `frontend/src/services/api.ts`

### Working with Reservations
When creating a sale with products:
1. Search products via Inventory API
2. Create reservations for each product (POST /reservations)
3. Process sale in backend
4. Confirm reservations (POST /reservations/:id/confirm) to deduct stock
5. If sale fails, release reservations (DELETE /reservations/:id)

### Database Changes
Always use Prisma migrations:
```bash
# Make changes to prisma/schema.prisma
npx prisma migrate dev --name descriptive_name
npx prisma generate
```
Never manually edit the database schema.

## Testing with Mock Data

The inventory-api includes 8 mock products (laptops, peripherals, monitors). See `inventory-api/README.md` for:
- Complete product list
- API endpoint examples
- Reservation workflow examples
- Health check endpoint: `http://localhost:3001/health`

## Important Notes

- **Inventory API is stateless**: All data is in-memory and resets on restart
- **No authentication**: Current implementation has no auth layer (add before production)
- **Port conflicts**: If ports 3000, 3001, or 5173 are in use, modify docker-compose.yml
- **Database URL**: In Docker, backend connects to `postgres:5432`; locally it's `localhost:5433`
- **CORS**: Backend has CORS enabled for all origins (restrict in production)
