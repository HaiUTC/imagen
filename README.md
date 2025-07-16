# Imagen - Multimodal AI Project

A sophisticated multimodal generative AI model that combines computer vision and structured data understanding to transform website screenshots and HTML structures into semantic layout descriptions.

## 🏗️ Project Structure

This project is organized as a monorepo with separate server and client applications:

```
imagen/
├── server/                 # Backend API (Node.js + Express + TypeScript)
│   ├── src/               # Server source code
│   ├── dist/              # Server build output (contained)
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # Server TypeScript config
├── client/                # Frontend (React + Vite + TypeScript)
│   ├── src/               # Client source code
│   ├── dist/              # Client build output (contained)
│   ├── package.json       # Client dependencies
│   └── vite.config.ts     # Vite build config
├── package.json           # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install all dependencies for both server and client
pnpm install

# Or install individually
pnpm --filter imagen-server install
pnpm --filter imagen-client install
```

### Development

```bash
# Start both server and client in development mode
pnpm dev

# Or start individually
pnpm build:server  # Start server only (port 4001)
pnpm build:client  # Start client only (port 3000)
```

### Building

```bash
# Build both server and client
pnpm build

# Or build individually
pnpm build:server  # Builds to server/dist/
pnpm build:client  # Builds to client/dist/
```

### Production

```bash
# Build and start server
pnpm build:server
pnpm start:server

# Build and preview client
pnpm build:client
pnpm start:client
```

## 📁 Build Output Structure

### Server Build (`server/dist/`)

- Compiled TypeScript files
- Express.js API server
- TSOA generated routes and swagger specs

### Client Build (`client/dist/`)

- Bundled React application
- Optimized assets and chunks
- Production-ready static files

## 🛠️ Key Features

### Server

- **Express.js** with TypeScript
- **TSOA** for API documentation and route generation
- **File Upload Support** with Multer
- **Environment Configuration** with dotenv
- **Multiple Image Generation APIs** (OpenAI, Ideogram, etc.)

### Client

- **React 19** with TypeScript
- **Vite** for fast development and building
- **API Proxy** configured for development
- **Code Splitting** and optimization

## 📋 Available Scripts

### Root Level (Workspace)

- `pnpm dev` - Start both server and client in development
- `pnpm build` - Build both applications
- `pnpm clean` - Remove all build directories
- `pnpm install:all` - Install all dependencies

### Server (`cd server/`)

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to dist/
- `pnpm start` - Start production server
- `pnpm tsoa` - Generate TSOA routes and specs

### Client (`cd client/`)

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build production bundle
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create `.env` files in the server directory:

```bash
# Server environment variables
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
VISION_API_KEY=your_vision_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4001
NODE_ENV=development
```

### API Endpoints

- **Server**: `http://localhost:4001`
- **Client**: `http://localhost:3000`
- **API Documentation**: `http://localhost:4001/api/v1/data/docs/`

The client automatically proxies `/api` requests to the server during development.

## 🔄 Development Workflow

1. **Start Development**: `pnpm dev`
2. **Make Changes**: Edit files in `server/src/` or `client/src/`
3. **Test Locally**: Both applications auto-reload on changes
4. **Build**: `pnpm build` creates production builds in respective `dist/` folders
5. **Deploy**: Use the built files from `server/dist/` and `client/dist/`

## 📦 Build Artifacts

All build outputs are contained within their respective directories:

- **Server builds** → `server/dist/`
- **Client builds** → `client/dist/`
- **TSOA specs** → `server/src/build/`

No build artifacts are created outside the server and client directories, ensuring a clean workspace structure.

## 🚀 Deployment

### Server Deployment

```bash
cd server/
pnpm build
pnpm start
```

### Client Deployment

```bash
cd client/
pnpm build
# Serve the client/dist/ folder with any static file server
```

The built applications are completely independent and can be deployed separately to different environments.
