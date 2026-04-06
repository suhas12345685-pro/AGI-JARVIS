const { execSync } = require('child_process');

async function exec(params) {
  const { cmd } = params;
  // Safety: block destructive commands
  const blocked = ['rm -rf /', 'mkfs', 'dd if=', ':(){', 'chmod -R 777 /'];
  for (const pattern of blocked) {
    if (cmd.includes(pattern)) {
      throw new Error(`Blocked dangerous command: ${cmd}`);
    }
  }

  const result = execSync(cmd, {
    timeout: 30000,
    encoding: 'utf-8',
    maxBuffer: 1024 * 1024,
  });
  return result.trim();
}

module.exports = { exec };
