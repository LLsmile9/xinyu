#!/bin/bash
while true; do
  if ! curl -s -o /dev/null -w "" http://localhost:3000 2>/dev/null; then
    echo "[$(date)] Server down, starting..." >> /home/z/my-project/watchdog.log
    cd /home/z/my-project
    node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    sleep 8
  fi
  sleep 5
done
