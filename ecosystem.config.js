module.exports = {
  apps: [
    {
      name: 'imagen',
      script: 'node -r ./tsconfig-paths-bootstrap.js dist/index.js',
      env: {
        // "NODE_ENV": "production",
      },
    },
  ],
};
