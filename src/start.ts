import { spawn } from 'child_process';
import { main } from './index';

// Path to Chrome
const chromeCommand = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = ['--remote-debugging-port=9222'];

// Start Chrome with debugging
const chromeProcess = spawn(chromeCommand, args, { detached: true, stdio: 'ignore' });

chromeProcess.on('error', (err) => {
  console.error('Failed to start Chrome:', err);
});

// Detach the Chrome process so it continues running after the Node process exits
chromeProcess.unref();

// Start your project
main();
