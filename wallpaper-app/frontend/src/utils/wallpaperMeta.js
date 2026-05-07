const COLOR_SWATCHES = [
  { key: 'black', label: 'Black', hex: '#050505' },
  { key: 'white', label: 'White', hex: '#eceff4' },
  { key: 'blue', label: 'Blue', hex: '#5b8bff' },
  { key: 'purple', label: 'Purple', hex: '#8a5cf6' },
  { key: 'red', label: 'Red', hex: '#ef4444' },
  { key: 'green', label: 'Green', hex: '#22c55e' },
  { key: 'yellow', label: 'Yellow', hex: '#facc15' },
  { key: 'orange', label: 'Orange', hex: '#fb923c' },
  { key: 'pink', label: 'Pink', hex: '#ec4899' },
  { key: 'cyan', label: 'Cyan', hex: '#06b6d4' },
]

const MOOD_RULES = {
  'rainy-night': {
    title: 'Rainy Night',
    description: 'Wet streets, soft neon, and late-night city calm.',
    hero: 'For moody reflections, midnight silence, and cinematic rain-soaked frames.',
    matchers: ['rain', 'night', 'city', 'neon', 'urban', 'moody'],
  },
  'coding-vibes': {
    title: 'Coding Vibes',
    description: 'Focused setups, dark gradients, and calm energy.',
    hero: 'Built for long sessions, ambient focus, and desk-friendly visual rhythm.',
    matchers: ['code', 'coding', 'dark', 'minimal', 'setup', 'tech', 'amoled'],
  },
  cyberpunk: {
    title: 'Cyberpunk',
    description: 'Neon density, high contrast, and future-noir attitude.',
    hero: 'Electric streets and synthetic color built for immersive screens.',
    matchers: ['cyberpunk', 'neon', 'purple', 'pink', 'city', 'futuristic'],
  },
  'dark-minimal': {
    title: 'Dark Minimal',
    description: 'Quiet shapes, restraint, and low-distraction depth.',
    hero: 'Minimal compositions and AMOLED-friendly stillness.',
    matchers: ['minimal', 'amoled', 'black', 'dark', 'clean'],
  },
  'bangalore-nights': {
    title: 'Bangalore Nights',
    description: 'Urban lights, traffic glow, and metropolitan atmosphere.',
    hero: 'A city mood board with movement, depth, and humid night energy.',
    matchers: ['night', 'urban', 'lights', 'city', 'rain'],
  },
  'bike-aesthetic': {
    title: 'Bike Aesthetic',
    description: 'Machines, speed, chrome, and sharp silhouettes.',
    hero: 'Performance visuals with momentum and road energy.',
    matchers: ['bike', 'bikes', 'motorcycle', 'racing', 'speed'],
  },
  'focus-mode': {
    title: 'Focus Mode',
    description: 'Clean, low-noise visuals that help you stay locked in.',
    hero: 'Distraction-light wallpapers built for productive sessions.',
    matchers: ['minimal', 'clean', 'abstract', 'simple', 'amoled'],
  },
  amoled: {
    title: 'AMOLED',
    description: 'True-dark screens for richer blacks and calmer light.',
    hero: 'Battery-friendly deep blacks, subtle glow, and high contrast restraint.',
    matchers: ['amoled', 'black', 'dark', 'minimal'],
  },
  'neon-city': {
    title: 'Neon City',
    description: 'Street glow, color haze, and modern nightlife.',
    hero: 'Bright signs, reflective asphalt, and dense urban luminance.',
    matchers: ['neon', 'city', 'urban', 'purple', 'pink', 'blue'],
  },
  'space-dreams': {
    title: 'Space Dreams',
    description: 'Cosmic quiet, star fields, and nebula depth.',
    hero: 'Built for wonder, scale, and the surreal calm of deep space.',
    matchers: ['space', 'nebula', 'galaxy', 'stars', 'cosmos'],
  },
}

export function getColorSwatches() {
  return COLOR_SWATCHES
}

function tokenize(wallpaper) {
  return [
    wallpaper?.title,
    wallpaper?.category,
    wallpaper?.tags,
    wallpaper?.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function inferWallpaperColors(wallpaper) {
  const text = tokenize(wallpaper)
  const hits = []

  if (/(amoled|black|dark|midnight|shadow|obsidian)/.test(text)) hits.push('black')
  if (/(white|snow|ivory|light)/.test(text)) hits.push('white')
  if (/(blue|ocean|sky|azure)/.test(text)) hits.push('blue')
  if (/(purple|violet|lavender)/.test(text)) hits.push('purple')
  if (/(red|scarlet|crimson|sunset)/.test(text)) hits.push('red')
  if (/(green|forest|emerald|nature)/.test(text)) hits.push('green')
  if (/(yellow|gold|amber|sun)/.test(text)) hits.push('yellow')
  if (/(orange|peach|fire)/.test(text)) hits.push('orange')
  if (/(pink|rose|magenta)/.test(text)) hits.push('pink')
  if (/(cyan|teal|aqua)/.test(text)) hits.push('cyan')

  if (!hits.length) {
    if (wallpaper?.category?.toLowerCase() === 'amoled') hits.push('black')
    else hits.push('blue')
  }

  return [...new Set(hits)]
}

export function wallpaperMatchesColor(wallpaper, color) {
  if (!color) return true
  return inferWallpaperColors(wallpaper).includes(color)
}

export function inferMoodTags(wallpaper) {
  const text = tokenize(wallpaper)
  const moods = []
  if (/(rain|night|neon|urban|city)/.test(text)) moods.push('moody')
  if (/(minimal|clean|simple|amoled)/.test(text)) moods.push('calm')
  if (/(space|nebula|galaxy|stars)/.test(text)) moods.push('dreamy')
  if (/(bike|racing|speed|sport)/.test(text)) moods.push('energetic')
  if (/(abstract|ai|digital|futuristic)/.test(text)) moods.push('future')
  if (!moods.length) moods.push('cinematic')
  return moods
}

export function getAspectRatioHint(wallpaper) {
  const text = tokenize(wallpaper)
  if (/(mobile|phone|1080x2400|1440x3120|portrait)/.test(text)) return 'portrait'
  if (/(square|1:1)/.test(text)) return 'square'
  return wallpaper?.id % 3 === 0 ? 'portrait' : wallpaper?.id % 3 === 1 ? 'square' : 'landscape'
}

export function scoreSimilarity(baseWallpaper, candidate) {
  if (!baseWallpaper || !candidate || baseWallpaper.id === candidate.id) return -1

  const baseTags = (baseWallpaper.tags || '').toLowerCase().split(',').map(item => item.trim()).filter(Boolean)
  const candidateTags = (candidate.tags || '').toLowerCase().split(',').map(item => item.trim()).filter(Boolean)
  const baseColors = inferWallpaperColors(baseWallpaper)
  const candidateColors = inferWallpaperColors(candidate)
  const baseMoods = inferMoodTags(baseWallpaper)
  const candidateMoods = inferMoodTags(candidate)

  let score = 0
  if (baseWallpaper.category === candidate.category) score += 4
  score += candidateTags.filter(tag => baseTags.includes(tag)).length * 3
  score += candidateColors.filter(color => baseColors.includes(color)).length * 2
  score += candidateMoods.filter(mood => baseMoods.includes(mood)).length * 1.5

  if ((candidate.title || '').toLowerCase().includes((baseWallpaper.category || '').toLowerCase())) score += 1
  return score
}

export function getRelatedWallpapers(baseWallpaper, wallpapers = []) {
  const scored = wallpapers
    .map(item => ({ item, score: scoreSimilarity(baseWallpaper, item) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item)

  return {
    moreLikeThis: scored.slice(0, 8),
    sameMood: scored.filter(item =>
      inferMoodTags(item).some(mood => inferMoodTags(baseWallpaper).includes(mood))
    ).slice(0, 8),
    similarColors: scored.filter(item =>
      inferWallpaperColors(item).some(color => inferWallpaperColors(baseWallpaper).includes(color))
    ).slice(0, 8),
    similarTags: scored.filter(item => {
      const baseTags = (baseWallpaper.tags || '').toLowerCase()
      return baseTags && (item.tags || '').toLowerCase().split(',').some(tag => baseTags.includes(tag.trim()))
    }).slice(0, 8),
  }
}

export function getMoodCollections() {
  return MOOD_RULES
}

export function filterByMood(wallpapers = [], slug) {
  const rule = MOOD_RULES[slug]
  if (!rule) return []
  return wallpapers.filter(wallpaper => {
    const text = tokenize(wallpaper)
    return rule.matchers.some(matcher => text.includes(matcher))
  })
}

export function getDiscoverySections(wallpapers = [], featured = []) {
  const items = wallpapers || []
  return [
    { key: 'trending', title: 'Trending Today', items: [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10) },
    { key: 'new', title: 'New Drops', items: [...items].slice(0, 10) },
    { key: 'amoled', title: 'AMOLED Picks', items: items.filter(item => wallpaperMatchesColor(item, 'black')).slice(0, 10) },
    { key: 'editors', title: 'Editor’s Choice', items: [...featured, ...items.filter(item => item.featured)].slice(0, 10) },
    { key: 'dark', title: 'Dark Aesthetic', items: items.filter(item => inferMoodTags(item).includes('calm') || wallpaperMatchesColor(item, 'black')).slice(0, 10) },
    { key: 'random', title: 'Random Discoveries', items: [...items].sort(() => Math.random() - 0.5).slice(0, 10) },
  ]
}

export function getWallpaperDeviceSuggestions(wallpaper) {
  const defaultRes = wallpaper?.resolution || '3840x2160'
  return [
    { key: 'iphone', label: 'iPhone', value: '1290x2796', device: 'phone' },
    { key: 'android', label: 'Android', value: '1440x3120', device: 'phone' },
    { key: 'desktop', label: 'Desktop', value: defaultRes, device: 'desktop' },
  ]
}

export function saveRecentSearch(query) {
  if (!query) return
  const existing = getRecentSearches().filter(item => item.toLowerCase() !== query.toLowerCase())
  const next = [query, ...existing].slice(0, 6)
  localStorage.setItem('recent_wallpaper_searches', JSON.stringify(next))
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('recent_wallpaper_searches') || '[]')
  } catch {
    return []
  }
}

export function applyClientSideFilters(wallpapers, { color, mood }) {
  return (wallpapers || []).filter(wallpaper => {
    const colorPass = !color || wallpaperMatchesColor(wallpaper, color)
    const moodPass = !mood || inferMoodTags(wallpaper).includes(mood)
    return colorPass && moodPass
  })
}
