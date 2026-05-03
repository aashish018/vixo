# WallpaperVault

Production-ready wallpaper application built with Spring Boot, PostgreSQL, Cloudinary, React, and Vite.

## What changed

- Premium mobile-first frontend with dark glassmorphism styling
- Infinite scroll, lazy-loaded images, and skeleton loading states
- Cloudinary-backed uploads for both remote image URLs and local files
- PostgreSQL-first backend configuration
- Per-IP rate limiting with Bucket4j: `100 requests / 10 minutes`
- DTO-based paginated APIs, global exception handling, request validation, and caching

## Stack

- Backend: Java 17, Spring Boot 3.2, Spring Data JPA, PostgreSQL, Bucket4j, Cloudinary, Caffeine Cache
- Frontend: React 18, Vite 5, React Router, Axios, Lucide, react-intersection-observer, react-hot-toast

## Backend setup

1. Create a PostgreSQL database named `wallpaperdb`.
2. Copy [backend/.env.example](backend/.env.example) values into your deployment environment or local shell.
3. Set required Cloudinary credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - Optional: `CLOUDINARY_FOLDER`
4. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Backend default URL: `http://localhost:8080`

## Frontend setup

1. Copy [frontend/.env.example](frontend/.env.example) into `.env` if you want an explicit API base URL.
2. Install dependencies and run Vite:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Cloudinary setup guide

1. Create a Cloudinary account at `https://cloudinary.com`.
2. Open the Cloudinary dashboard.
3. Copy your `Cloud Name`, `API Key`, and `API Secret`.
4. Add them to the backend environment.
5. Optional: set `CLOUDINARY_FOLDER=wallpaper-app` or another folder name to keep uploads organized.
6. Start the backend and use either:
   - `POST /api/wallpapers` with a remote `imageUrl`
   - `POST /api/wallpapers/upload` with multipart file upload
7. The backend uploads the asset to Cloudinary and stores the returned `imageUrl`, `thumbnailUrl`, and `publicId`.

## Environment variables

### Backend

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `CORS_ALLOWED_ORIGINS`
- `CORS_ALLOWED_METHODS`
- `APP_RATE_LIMIT_CAPACITY`
- `APP_RATE_LIMIT_DURATION_MINUTES`
- `APP_UPLOAD_MAX_FILE_SIZE`
- `APP_UPLOAD_MAX_REQUEST_SIZE`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`
- `APP_SEED_ENABLED`

### Frontend

- `VITE_API_BASE_URL`

## API overview

### Wallpapers

- `GET /api/wallpapers?page=0&size=12&sort=latest`
- `GET /api/wallpapers?category=Nature`
- `GET /api/wallpapers?search=neon`
- `GET /api/wallpapers/{id}`
- `POST /api/wallpapers`
- `POST /api/wallpapers/upload`
- `POST /api/wallpapers/{id}/download`
- `DELETE /api/wallpapers/{id}`
- `GET /api/wallpapers/categories`
- `GET /api/wallpapers/featured`

### Example create-by-URL request

```bash
curl -X POST http://localhost:8080/api/wallpapers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aurora Skyline",
    "imageUrl": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "category": "Nature",
    "tags": "aurora,night,sky",
    "resolution": "3840x2160",
    "description": "Cold night tones with a sharp aurora horizon",
    "featured": true
  }'
```

## Production notes

- Rate limiting is in-memory, which is suitable for a single instance or moderate traffic. For multi-instance deployments, move the limiter state to Redis.
- Caching uses Caffeine with a 10-minute TTL for wallpaper lists, detail responses, featured items, and categories.
- `spring.jpa.open-in-view` is disabled to avoid lazy-loading surprises in production.
- `server.forward-headers-strategy=framework` helps preserve real client IPs behind proxies so rate limiting works more reliably.
- The backend now fails fast if Cloudinary credentials are missing.

## Build

### Backend

```bash
cd backend
mvn clean package -DskipTests
```

### Frontend

```bash
cd frontend
npm run build
```

## Deployment

- Backend: build with the included [backend/Dockerfile](backend/Dockerfile)
- Frontend: deploy `frontend/dist` to Vercel, Netlify, Nginx, or another static host
- Set `CORS_ALLOWED_ORIGINS` to your frontend domain in production

