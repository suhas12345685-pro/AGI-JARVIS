const { spawn } = require('child_process');

function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', [scriptPath, ...args]);
    let output = '';
    let error = '';
    proc.stdout.on('data', d => output += d.toString());
    proc.stderr.on('data', d => error += d.toString());
    proc.on('close', code => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}: ${error}`));
      }
    });
  });
}

module.exports = { runPythonScript };
