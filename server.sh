#!/bin/bash
# Persistent Next.js dev server with auto-restart
cd /home/z/my-project
while true; do
  echo "Starting Next.js dev server..."
  node node_modules/.bin/next dev -p 3000 2>&1
  EXIT_CODE=$?
  echo "Server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
