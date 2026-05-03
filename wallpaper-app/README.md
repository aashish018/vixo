# 🖼️ WallpaperVault — Full-Stack Wallpaper Web App

A production-ready wallpaper web application built with **Java Spring Boot** (backend) and **React + Vite** (frontend), using **H2** as the database.

---

## 🗂️ Project Structure

```
wallpaper-app/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/wallpaper/app/
│   │   ├── WallpaperAppApplication.java
│   │   ├── controller/         # REST endpoints
│   │   ├── model/              # JPA entity + DTOs
│   │   ├── repository/         # Spring Data JPA
│   │   ├── service/            # Business logic
│   │   └── config/             # CORS, seeder, web config
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── pages/              # HomePage, DetailPage, AdminPage
│   │   ├── components/         # Navbar, WallpaperCard, Filters
│   │   ├── utils/api.js        # Axios API layer
│   │   └── assets/global.css  # Global dark-mode styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── uploads/                    # Local uploaded images stored here
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Java 17+** (check: `java -version`)
- **Maven 3.6+** (check: `mvn -version`)
- **Node.js 18+** (check: `node -version`)
---

## 🚀 Running the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

> First run auto-seeds the database with 10 sample wallpapers!

**H2 Console** (for debugging): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/wallpaperdb`
- Username: `sa`, Password: *(empty)*

---

## 🎨 Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

> The Vite dev server proxies `/api` requests to the Spring Boot backend automatically.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallpapers` | Get paginated wallpapers |
| GET | `/api/wallpapers?category=Nature` | Filter by category |
| GET | `/api/wallpapers?search=sunset` | Search by title/tags |
| GET | `/api/wallpapers?sort=trending` | Sort (latest/trending/popular/oldest) |
| GET | `/api/wallpapers?page=0&size=12` | Paginate |
| GET | `/api/wallpapers/{id}` | Get wallpaper by ID |
| POST | `/api/wallpapers` | Add via URL (JSON body) |
| POST | `/api/wallpapers/upload` | Upload local file (multipart) |
| POST | `/api/wallpapers/{id}/download` | Track download + get URL |
| DELETE | `/api/wallpapers/{id}` | Delete wallpaper |
| GET | `/api/wallpapers/categories` | List all categories |
| GET | `/api/wallpapers/featured` | Get featured wallpapers |

### Example: Add wallpaper via URL

```bash
curl -X POST http://localhost:8080/api/wallpapers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aurora Borealis",
    "imageUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=70",
    "category": "Nature",
    "tags": "aurora, northern lights, sky, night",
    "resolution": "1920x1080",
    "description": "Stunning aurora borealis over snow-capped mountains",
    "featured": true
  }'
```

---

## 🖼️ How to Add Wallpapers Using URLs

### Option 1: Admin Panel (Recommended)
1. Open http://localhost:5173/admin
2. Click **"Image URL"** tab
3. Paste any image URL and fill in the details
4. Click **Add Wallpaper**

### Option 2: GitHub Raw Links
Upload images to a GitHub repo and use the raw URL:
```
https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/wallpapers/my-image.jpg
```

### Option 3: Unsplash (Best for free HD images)
```
https://images.unsplash.com/photo-PHOTO_ID?w=1920&q=80        ← Full HD
https://images.unsplash.com/photo-PHOTO_ID?w=600&q=70         ← Thumbnail
```

### Option 4: Google Drive
1. Upload image to Google Drive
2. Right-click → "Share" → "Anyone with the link"
3. Get the file ID from the share URL
4. Use: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`

---

## 🔄 Switching to MySQL (Production)

1. Add MySQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wallpaperdb?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 💰 AdSense Integration

AdSense placeholder divs are already in the UI. To activate:

1. Get your AdSense code from https://adsense.google.com
2. In `frontend/index.html`, uncomment and replace the script tag:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
```
3. Replace the placeholder divs in `HomePage.jsx` and `WallpaperDetailPage.jsx`:
```jsx
<ins className="adsbygoogle"
  style={{display: 'block'}}
  data-ad-client="ca-pub-YOUR_ID"
  data-ad-slot="YOUR_SLOT_ID"
  data-ad-format="auto"
  data-full-width-responsive="true" />
```

---

## 🔍 SEO

- Meta tags are in `frontend/index.html` (Open Graph, Twitter Card, description)
- Page title updates dynamically on wallpaper detail pages
- Categories generate SEO-friendly URLs: `/?category=Nature`
- Search terms generate URLs: `/?search=sunset`

---

## 🏗️ Build for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/wallpaper-app-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/ — deploy to any static host (Netlify, Vercel, Nginx)
```

### Serve frontend from Spring Boot (optional)
Copy `frontend/dist/*` to `backend/src/main/resources/static/` and rebuild.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Wallpaper grid with lazy loading | ✅ |
| Category filtering | ✅ |
| Search (title + tags) | ✅ |
| Sorting (Latest, Trending, Popular, Oldest) | ✅ |
| Pagination | ✅ |
| Wallpaper detail page | ✅ |
| Download HD + click tracking | ✅ |
| Resolution display | ✅ |
| Tags with search links | ✅ |
| Admin: add via URL | ✅ |
| Admin: local file upload | ✅ |
| Admin: delete with confirmation | ✅ |
| Dark mode UI | ✅ |
| Mobile responsive | ✅ |
| AdSense placeholders | ✅ |
| SEO meta tags | ✅ |
| Spring Cache | ✅ |
| H2 persistent DB | ✅ |
| 10 sample wallpapers (auto-seeded) | ✅ |

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Spring Cache, Lombok
- **Database**: H2 (file-based, persistent)
- **Frontend**: React 18, Vite 5, React Router 6, Axios, react-hot-toast
- **Styling**: CSS Modules, CSS Variables (dark mode)
- **Icons**: Lucide React
- **Fonts**: Syne + DM Sans (Google Fonts)

---

## 📝 License

MIT — free to use and modify.
