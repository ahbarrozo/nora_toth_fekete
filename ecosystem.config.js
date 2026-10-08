module.exports = {
  apps: [
    {
      name: "back",
      cwd: "/apps/back",
      script: "bun",
      args: "run dist/index.js > log",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "front",
      cwd: "/apps/front",
      script: "node",
      args: "build",
      env: {
        NODE_ENV: "production",
        BODY_SIZE_LIMIT: "Infinity",
        PORT: 5173,
        HOST: "0.0.0.0",
        ORIGIN: "https://nora-toth-fekete.fly.dev"
      }
    }
  ]
};
