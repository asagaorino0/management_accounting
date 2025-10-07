import { spawn } from 'child_process';

// Start Next.js dev server
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

nextDev.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextDev.on('close', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
  process.exit(0);
});
