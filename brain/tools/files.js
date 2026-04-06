const fs = require('fs');
const path = require('path');

async function read(params) {
  const filePath = path.resolve(params.path);
  return fs.readFileSync(filePath, 'utf-8');
}

async function write(params) {
  const filePath = path.resolve(params.path);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, params.content, 'utf-8');
  return `File written: ${filePath}`;
}

module.exports = { read, write };
