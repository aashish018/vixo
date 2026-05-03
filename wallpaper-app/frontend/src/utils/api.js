import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 429) {
      error.userMessage = 'Too many requests from this network. Please wait a few minutes and try again.'
    } else {
      error.userMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong. Please try again.'
    }
    return Promise.reject(error)
  }
)

export const getWallpapers = ({ category, search, sort = 'latest', page = 0, size = 12 } = {}) => {
  const params = { page, size, sort }
  if (category && category !== 'All') params.category = category
  if (search) params.search = search
  return api.get('/wallpapers', { params }).then(response => response.data)
}

export const getWallpaper = id =>
  api.get(`/wallpapers/${id}`).then(response => response.data)

export const createWallpaper = data =>
  api.post('/wallpapers', data).then(response => response.data)

export const uploadWallpaper = formData =>
  api.post('/wallpapers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(response => response.data)

export const deleteWallpaper = id =>
  api.delete(`/wallpapers/${id}`).then(response => response.data)

export const trackDownload = id =>
  api.post(`/wallpapers/${id}/download`).then(response => response.data)

export const getCategories = () =>
  api.get('/wallpapers/categories').then(response => response.data)

export const getFeatured = () =>
  api.get('/wallpapers/featured').then(response => response.data)

export default api
