# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Workspace Commands (Run from root)
- `pnpm dev` - Start both server and client in development mode
- `pnpm build` - Build both server and client applications  
- `pnpm build:server` - Build server only to `server/dist/`
- `pnpm build:client` - Build client only to `client/dist/`
- `pnpm start:server` - Start production server (port 4001)
- `pnpm start:client` - Start production client (port 3001)
- `pnpm clean` - Remove all build directories
- `pnpm deploy` - Build and restart with PM2

### Server Commands (Run from `server/`)  
- `pnpm dev` - Start development server with hot reload and TSOA route generation
- `pnpm build` - Generate TSOA routes/specs and compile TypeScript
- `pnpm start` - Start production server
- `pnpm tsoa` - Generate TSOA routes and OpenAPI specs manually

### Client Commands (Run from `client/`)
- `pnpm dev` - Start Vite development server (port 3000)
- `pnpm build` - Build production bundle with TypeScript compilation
- `pnpm preview` - Preview production build (port 3001)
- `pnpm lint` - Run ESLint

## Project Architecture

### Monorepo Structure
- `server/` - Node.js + Express + TypeScript backend with TSOA
- `client/` - React 19 + Vite + TypeScript frontend with Shopify Polaris
- Uses pnpm workspaces for dependency management

### Server Architecture (Clean Architecture/Hexagonal)
- **Controllers** (`src/controllers/`) - HTTP request handlers (not TSOA routes)
- **Routes** (`src/frame-works/web-server/routes/`) - TSOA route definitions  
- **Applications/Flow** (`src/applications/flow/`) - Business logic orchestration
- **Domains** (`src/domains/`) - Core entities and port interfaces
- **Infrastructures** (`src/infrastructures/`) - External service implementations  
- **Frameworks** (`src/frame-works/`) - Database, web server, and repository implementations

### Client Architecture (Domain-Driven Design)
- **Containers** (`src/containers/`) - Page-level React components
- **Domain** (`src/domain/`) - Business entities, errors, and port interfaces
- **Infrastructure** (`src/infrastructure/`) - API service implementations
- **Flow** (`src/flow/`) - Business logic orchestration
- **Store** (`src/store/`) - Zustand state management
- **Libs** (`src/libs/`) - Reusable components and utilities

### Key Technical Details

#### API Generation
- Server uses TSOA for automatic route generation and OpenAPI spec creation
- Routes are auto-generated to `server/src/build/routes.ts`
- OpenAPI spec generated to `server/src/build/swagger.json` 
- Available at `http://localhost:4001/api/v1/data/docs/` in development

#### Database
- MongoDB with Mongoose ODM
- Singleton connection pattern in `server/src/frame-works/database/connection.ts`
- Repository pattern for data access

#### State Management  
- Client uses Zustand for state management
- Main stores: `imagen.store.ts`, `template.store.ts`, `generate-image.store.ts`
- Store handles both generate and edit image workflows

#### File Structure Patterns
- Server uses `~/*` path alias for `src/` directory
- Client follows domain-driven structure with clear separation of concerns
- Both applications build to their respective `dist/` directories

#### Environment Setup
- Server requires `.env` with MongoDB, API keys (OpenAI, Supabase), and configuration
- Client uses Vite environment variables (VITE_APP_BE_CDN)
- Development proxy: Client proxies `/api` requests to server

#### Build Process
- Server: TSOA generation → TypeScript compilation → Node.js production files
- Client: TypeScript compilation → Vite bundling → Static files
- PM2 ecosystem configuration for production deployment

## Important Notes

### Before Making Changes
- Always run `pnpm dev` to start both applications for full functionality
- Server must be running for client API calls to work
- TSOA routes are auto-generated - modify route files, not generated routes

### Testing and Validation
- No specific test commands found - verify with user before implementing tests
- Use `pnpm lint` for client-side code quality checks
- Check API documentation at `/api/v1/data/docs/` after server changes