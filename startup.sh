#!/bin/bash
# startup.sh — Start all JARVIS processes

echo "╔══════════════════════════════════════╗"
echo "║     Starting J.A.R.V.I.S.           ║"
echo "╚══════════════════════════════════════╝"

# Start services
echo "Starting Redis..."
redis-server --daemonize yes 2>/dev/null || echo "Redis already running or not installed"

echo "Starting ChromaDB..."
chroma run --path ./memory/vector/chroma_store &>/dev/null &

# Start brain via PM2
echo "Starting JARVIS processes via PM2..."
pm2 start ecosystem.config.js

# Start Cloudflare tunnel (optional)
if command -v cloudflared &>/dev/null; then
  echo "Starting Cloudflare tunnel..."
  cloudflared tunnel --url http://localhost:3000 &>/dev/null &
fi

# Wait and verify
sleep 3
HEALTH=$(curl -s http://localhost:3000/health 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null)

if [ "$HEALTH" = "online" ]; then
  echo ""
  echo "╔══════════════════════════════════════╗"
  echo "║     J.A.R.V.I.S. is ONLINE          ║"
  echo "╚══════════════════════════════════════╝"
  echo ""
  echo "  Brain:     http://localhost:3000"
  echo "  Laptop:    http://localhost:8080"
  echo "  Status:    pm2 status"
  echo "  Logs:      pm2 logs"
else
  echo ""
  echo "❌ Brain health check failed."
  echo "   Check logs: pm2 logs jarvis-brain"
fi
