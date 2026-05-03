#!/bin/bash

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      WallpaperVault — Starting...    ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Start backend
echo "▶ Starting Spring Boot backend on :8080..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend
echo "⏳ Waiting for backend to start..."
until curl -s http://localhost:8080/api/wallpapers/categories > /dev/null 2>&1; do
  sleep 2
done
echo "✅ Backend ready!"

# Start frontend
echo "▶ Starting Vite frontend on :5173..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ App running!"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8080"
echo "   Admin:     http://localhost:5173/admin"
echo "   H2 Console: http://localhost:8080/h2-console"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
wait
