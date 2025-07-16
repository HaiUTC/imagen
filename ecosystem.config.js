module.exports = {
  apps: [
    {
      name: "imagen_backend",
      script: "node",
      args: "-r ./tsconfig-paths-bootstrap.js ./dist/index.js",
      cwd: "./server",
      env: {
        NODE_ENV: "development",
        PORT: 4001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4001,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
    {
      name: "imagen_frontend",
      script: "pnpm",
      args: "preview --port 3001",
      cwd: "./client",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
