const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting File-Converter (All-in-One Utility)...');
console.log('==================================================');

// Helper to log process output with prefixes
const logOutput = (processName, prefixColor, data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) {
      console.log(`[${prefixColor}${processName}\x1b[0m] ${line}`);
    }
  });
};

// Spawn backend server
const backendDir = path.join(__dirname, 'backend');
console.log(`Starting Backend in ${backendDir}...`);
const backend = spawn('npm', ['run', 'dev'], { cwd: backendDir, shell: true });

backend.stdout.on('data', (data) => logOutput('Backend', '\x1b[32m', data)); // green
backend.stderr.on('data', (data) => logOutput('Backend Error', '\x1b[31m', data)); // red

// Spawn frontend server
const frontendDir = path.join(__dirname, 'frontend');
console.log(`Starting Frontend in ${frontendDir}...`);
const frontend = spawn('npm', ['run', 'dev'], { cwd: frontendDir, shell: true });

frontend.stdout.on('data', (data) => logOutput('Frontend', '\x1b[36m', data)); // cyan
frontend.stderr.on('data', (data) => logOutput('Frontend Error', '\x1b[31m', data)); // red

// Handle exit cleanly
const cleanup = () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  cleanup();
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
  cleanup();
});
