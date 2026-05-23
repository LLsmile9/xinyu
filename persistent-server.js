// Persistent Next.js dev server launcher
// This script spawns the Next.js server and auto-restarts it if it crashes
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const PROJECT_DIR = '/home/z/my-project';
const PORT = 3000;
const CHECK_INTERVAL = 5000; // Check every 5 seconds
const RESTART_DELAY = 2000; // Wait 2s before restarting

let child = null;
let isShuttingDown = false;

function startServer() {
  if (isShuttingDown) return;
  
  console.log(`[${new Date().toISOString()}] Starting Next.js dev server...`);
  
  child = spawn('node', [
    path.join(PROJECT_DIR, 'node_modules/.bin/next'),
    'dev', '-p', String(PORT)
  ], {
    cwd: PROJECT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  child.on('exit', (code, signal) => {
    console.log(`[${new Date().toISOString()}] Server exited (code=${code}, signal=${signal})`);
    child = null;
    if (!isShuttingDown) {
      console.log(`[${new Date().toISOString()}] Restarting in ${RESTART_DELAY}ms...`);
      setTimeout(startServer, RESTART_DELAY);
    }
  });
}

function checkHealth() {
  if (isShuttingDown) return;
  
  const req = http.get(`http://localhost:${PORT}`, (res) => {
    res.resume(); // consume response data
    // Server is healthy
  });
  
  req.on('error', () => {
    // Server is not responding
    if (child) {
      console.log(`[${new Date().toISOString()}] Health check failed, killing server...`);
      child.kill('SIGTERM');
      // Force kill after 5s
      setTimeout(() => {
        if (child) child.kill('SIGKILL');
      }, 5000);
    }
  });
  
  req.setTimeout(3000, () => {
    req.destroy();
  });
}

// Start the server
startServer();

// Periodic health check
setInterval(checkHealth, CHECK_INTERVAL);

// Graceful shutdown
process.on('SIGTERM', () => {
  isShuttingDown = true;
  if (child) child.kill('SIGTERM');
  setTimeout(() => process.exit(0), 3000);
});

process.on('SIGINT', () => {
  isShuttingDown = true;
  if (child) child.kill('SIGTERM');
  setTimeout(() => process.exit(0), 3000);
});

// Keep process alive
setInterval(() => {}, 60000);
