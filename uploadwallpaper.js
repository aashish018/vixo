const wallpapers = [
  {
    "title": "Aurora Borealis Night Sky",
    "imageUrl": "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=3840&q=80",
    "category": "Nature",
    "tags": "aurora, northern lights, night, sky, stars, 4k",
    "resolution": "3840x2160",
    "description": "Vibrant northern lights illuminating the night sky.",
    "featured": true
  },
  {
    "title": "Calm Mirror Lake",
    "imageUrl": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=3840&q=80",
    "category": "Nature",
    "tags": "lake, reflection, calm, water, peaceful, 4k",
    "resolution": "3840x2160",
    "description": "A peaceful lake reflecting mountains and sky.",
    "featured": true
  },
  {
    "title": "Dense Forest Canopy",
    "imageUrl": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&q=80",
    "category": "Nature",
    "tags": "forest, trees, green, canopy, aerial, 4k",
    "resolution": "3840x2160",
    "description": "Thick green forest canopy viewed from above.",
    "featured": true
  },
  {
    "title": "River Through Valley",
    "imageUrl": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=3840&q=80",
    "category": "Nature",
    "tags": "river, valley, landscape, scenic, 4k",
    "resolution": "3840x2160",
    "description": "A winding river flowing through a lush valley.",
    "featured": true
  },
  {
    "title": "Sunrise Over Mountains",
    "imageUrl": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=3840&q=80",
    "category": "Nature",
    "tags": "sunrise, mountains, clouds, golden hour, 4k",
    "resolution": "3840x2160",
    "description": "Sunlight breaking over mountain peaks at dawn.",
    "featured": true
  },
  {
    "title": "Tropical Beach Paradise",
    "imageUrl": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=3840&q=80",
    "category": "Nature",
    "tags": "beach, tropical, sea, sand, paradise, 4k",
    "resolution": "3840x2160",
    "description": "Crystal clear waters and white sandy beach.",
    "featured": true
  },
  {
    "title": "Autumn Forest Colors",
    "imageUrl": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=3840&q=80",
    "category": "Nature",
    "tags": "autumn, forest, leaves, orange, fall, 4k",
    "resolution": "3840x2160",
    "description": "Forest filled with vibrant autumn foliage.",
    "featured": true
  },
  {
    "title": "Starry Night Sky",
    "imageUrl": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=3840&q=80",
    "category": "Nature",
    "tags": "stars, night, sky, galaxy, dark, 4k",
    "resolution": "3840x2160",
    "description": "A clear night sky full of bright stars.",
    "featured": true
  },
  {
    "title": "Blue Glacier Ice",
    "imageUrl": "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=3840&q=80",
    "category": "Nature",
    "tags": "glacier, ice, blue, cold, arctic, 4k",
    "resolution": "3840x2160",
    "description": "Massive glacier formations glowing blue.",
    "featured": true
  },
  {
    "title": "Wildflower Meadow",
    "imageUrl": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=3840&q=80",
    "category": "Nature",
    "tags": "flowers, meadow, spring, colorful, 4k",
    "resolution": "3840x2160",
    "description": "A meadow filled with vibrant wildflowers.",
    "featured": true
  },
  {
    "title": "Cliffside Ocean View",
    "imageUrl": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3840&q=80",
    "category": "Nature",
    "tags": "cliffs, ocean, coast, dramatic, 4k",
    "resolution": "3840x2160",
    "description": "Steep cliffs overlooking the vast ocean.",
    "featured": true
  },
  {
    "title": "Rainforest Green Path",
    "imageUrl": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=3840&q=80",
    "category": "Nature",
    "tags": "rainforest, path, jungle, green, 4k",
    "resolution": "3840x2160",
    "description": "A narrow path through dense rainforest.",
    "featured": true
  },
  {
    "title": "Sunset Lake Reflection",
    "imageUrl": "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=3840&q=80",
    "category": "Nature",
    "tags": "sunset, lake, reflection, orange, calm, 4k",
    "resolution": "3840x2160",
    "description": "Warm sunset reflecting over still water.",
    "featured": true
  },
  {
    "title": "Snowy Mountain Peaks",
    "imageUrl": "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=3840&q=80",
    "category": "Nature",
    "tags": "snow, mountains, winter, cold, 4k",
    "resolution": "3840x2160",
    "description": "Snow-covered peaks under a clear sky.",
    "featured": true
  },
  {
    "title": "Foggy Green Hills",
    "imageUrl": "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=3840&q=80",
    "category": "Nature",
    "tags": "fog, hills, green, moody, 4k",
    "resolution": "3840x2160",
    "description": "Rolling hills covered in soft morning fog.",
    "featured": true
  }
  // 👉 Add remaining items here (same format)
];

async function uploadWallpapers() {
  console.log("🚀 Starting upload...");

  for (const wallpaper of wallpapers) {
    try {
      console.log("Uploading:", wallpaper.title);

      const res = await fetch("https://vixo-zixo.onrender.com/api/wallpapers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(wallpaper)
      });

      const data = await res.json();
      console.log("✅ Success:", data);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }

  console.log("🎉 Done!");
}

uploadWallpapers();