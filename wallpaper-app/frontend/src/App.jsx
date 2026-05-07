import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import WallpaperDetailPage from './pages/WallpaperDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/wallpaper/:id" element={<WallpaperDetailPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/admin"    element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
