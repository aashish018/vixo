import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// ─── Wallpapers ───────────────────────────────────────────────────────────────

export const getWallpapers = ({ category, search, sort = 'latest', page = 0, size = 12 } = {}) => {
  const params = { page, size, sort };
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  return api.get('/wallpapers', { params }).then(r => r.data);
};

export const getWallpaper = (id) =>
  api.get(`/wallpapers/${id}`).then(r => r.data);

export const createWallpaper = (data) =>
  api.post('/wallpapers', data).then(r => r.data);

export const uploadWallpaper = (formData) =>
  api.post('/wallpapers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);

export const deleteWallpaper = (id) =>
  api.delete(`/wallpapers/${id}`).then(r => r.data);

export const trackDownload = (id) =>
  api.post(`/wallpapers/${id}/download`).then(r => r.data);

export const getCategories = () =>
  api.get('/wallpapers/categories').then(r => r.data);

export const getFeatured = () =>
  api.get('/wallpapers/featured').then(r => r.data);

export default api;
