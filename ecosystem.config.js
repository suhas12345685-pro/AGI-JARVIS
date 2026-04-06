module.exports = {
  apps: [
    {
      name: 'jarvis-brain',
      script: './brain/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'jarvis-voice',
      script: './voice/interceptor.py',
      interpreter: 'python3',
      autorestart: true,
    },
    {
      name: 'jarvis-laptop',
      script: './connectors/laptop/server.py',
      interpreter: 'python3',
      autorestart: true,
    },
    {
      name: 'jarvis-telegram',
      script: './connectors/messaging/telegram.js',
      autorestart: true,
    }
  ]
};
