#!/bin/bash
# Custom dev script for Z.ai sandbox
# This is executed by /start.sh during container initialization
cd /home/z/my-project

echo "[DEV] Installing dependencies..."
bun install

echo "[DEV] Setting up database..."
bun run db:push

echo "[DEV] Starting development server..."
exec node node_modules/.bin/next dev -p 3000
