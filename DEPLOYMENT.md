# 🚀 Deployment Guide

This guide explains how to deploy your Imagen project using PM2 with the refactored monorepo structure.

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PM2 installed globally: `npm install -g pm2`

## 🔧 Fixed Configuration Issues

The `ecosystem.config.js` has been corrected to work with the new structure:

### ✅ **Before (Broken):**

```javascript
{
  name: "imagen_backend",
  script: "node -r ./tsconfig-paths-bootstrap.js server/dist/index.js", // ❌ Wrong path
  cwd: undefined, // ❌ No working directory
}
{
  name: "imagen_frontend",
  script: "npm", // ❌ Should use pnpm
  args: "start", // ❌ No start script in client
  cwd: "./frontend", // ❌ Directory doesn't exist
}
```

### ✅ **After (Fixed):**

```javascript
{
  name: "imagen_backend",
  script: "node",
  args: "-r ./tsconfig-paths-bootstrap.js ./dist/index.js", // ✅ Correct relative path
  cwd: "./server", // ✅ Run from server directory
}
{
  name: "imagen_frontend",
  script: "pnpm", // ✅ Use pnpm
  args: "preview --port 3001", // ✅ Use preview command
  cwd: "./client", // ✅ Correct directory
}
```

## 🚀 Deployment Steps

### 1. **Build Applications**

```bash
# Build both server and client
pnpm build
```

### 2. **Environment Setup**

Ensure your `.env` file is in the `server/` directory:

```bash
# Copy environment file if needed
cp .env server/.env
```

### 3. **Start with PM2**

```bash
# Start both applications
pnpm pm2:start

# Or manually
pm2 start ecosystem.config.js
```

### 4. **Monitor Applications**

```bash
# Check status
pnpm pm2:status

# View logs
pnpm pm2:logs

# View specific app logs
pm2 logs imagen_backend
pm2 logs imagen_frontend
```

## 📋 Available PM2 Commands

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `pnpm pm2:start`   | Start both applications             |
| `pnpm pm2:stop`    | Stop both applications              |
| `pnpm pm2:restart` | Restart both applications           |
| `pnpm pm2:delete`  | Delete PM2 processes                |
| `pnpm pm2:logs`    | View all logs                       |
| `pnpm pm2:status`  | Check process status                |
| `pnpm deploy`      | Build and restart (full deployment) |

## 🌐 Application URLs

After successful deployment:

- **Backend API**: http://localhost:4001
- **API Documentation**: http://localhost:4001/api/v1/data/docs/
- **Frontend**: http://localhost:3001

## 🔄 Update Deployment

For updates after code changes:

```bash
# Quick update (build + restart)
pnpm deploy

# Manual steps
pnpm build
pnpm pm2:restart
```

## 🏗️ Production Considerations

### Environment Variables

Ensure these are set in `server/.env`:

```bash
NODE_ENV=production
PORT=4001
OPENAI_API_KEY=your_key
OPENAI_BASE_URL=https://api.openai.com/v1
VISION_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### Process Management

- **Auto-restart**: Enabled (max 10 restarts)
- **Min uptime**: 10 seconds before considering stable
- **Watch**: Disabled (use PM2 restart for updates)

### Reverse Proxy (Optional)

For production, consider using Nginx:

```nginx
# Frontend
location / {
    proxy_pass http://localhost:3001;
}

# Backend API
location /api {
    proxy_pass http://localhost:4001;
}
```

## 🐛 Troubleshooting

### Backend Issues

```bash
# Check if server directory has required files
ls -la server/dist/
ls -la server/tsconfig-paths-bootstrap.js

# Check environment
cat server/.env
```

### Frontend Issues

```bash
# Check if client build exists
ls -la client/dist/

# Verify preview command works
cd client && pnpm preview
```

### PM2 Issues

```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.js

# Check PM2 logs for errors
pm2 logs --lines 50
```
