package com.wallpaper.app.config;

import com.wallpaper.app.model.Wallpaper;
import com.wallpaper.app.repository.WallpaperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final WallpaperRepository wallpaperRepository;

    @Override
    public void run(String... args) {
        if (wallpaperRepository.count() > 0) {
            log.info("Database already seeded. Skipping...");
            return;
        }

        log.info("Seeding database with sample wallpapers...");

        List<Wallpaper> wallpapers = List.of(
            Wallpaper.builder()
                .title("Misty Mountain Range")
                .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70")
                .category("Nature")
                .tags("mountains,mist,landscape,fog,scenic")
                .resolution("1920x1080")
                .description("Breathtaking misty mountain range at sunrise")
                .featured(true)
                .downloadCount(342L)
                .viewCount(1520L)
                .build(),

            Wallpaper.builder()
                .title("Neon City Nights")
                .imageUrl("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=70")
                .category("Urban")
                .tags("city,neon,night,lights,urban,cyberpunk")
                .resolution("1920x1080")
                .description("City skyline blazing with neon lights at night")
                .featured(true)
                .downloadCount(521L)
                .viewCount(2310L)
                .build(),

            Wallpaper.builder()
                .title("Abstract AI Dream")
                .imageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=70")
                .category("AI Art")
                .tags("abstract,ai,colorful,digital,art,generative")
                .resolution("1920x1080")
                .description("Vibrant AI-generated abstract digital artwork")
                .featured(false)
                .downloadCount(890L)
                .viewCount(3200L)
                .build(),

            Wallpaper.builder()
                .title("Pure Black AMOLED")
                .imageUrl("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=70")
                .category("AMOLED")
                .tags("amoled,dark,black,minimal,battery-saving")
                .resolution("1080x2400")
                .description("Ultra dark AMOLED wallpaper that saves battery")
                .featured(false)
                .downloadCount(1203L)
                .viewCount(4500L)
                .build(),

            Wallpaper.builder()
                .title("Minimal White Lines")
                .imageUrl("https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=70")
                .category("Minimal")
                .tags("minimal,clean,lines,geometric,simple,white")
                .resolution("1920x1080")
                .description("Clean minimalist geometric line art")
                .featured(false)
                .downloadCount(456L)
                .viewCount(1890L)
                .build(),

            Wallpaper.builder()
                .title("Kawasaki Ninja on Curve")
                .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70")
                .category("Bikes")
                .tags("motorcycle,kawasaki,sport,racing,speed,bike")
                .resolution("1920x1080")
                .description("Kawasaki Ninja sport bike leaning into a curve")
                .featured(true)
                .downloadCount(780L)
                .viewCount(3100L)
                .build(),

            Wallpaper.builder()
                .title("Ocean Sunset Horizon")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70")
                .category("Nature")
                .tags("ocean,sunset,beach,waves,golden,horizon,sea")
                .resolution("1920x1080")
                .description("Golden sunset reflecting on calm ocean waters")
                .featured(false)
                .downloadCount(612L)
                .viewCount(2700L)
                .build(),

            Wallpaper.builder()
                .title("Deep Space Nebula")
                .imageUrl("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=70")
                .category("Space")
                .tags("space,nebula,galaxy,stars,cosmos,universe,astronomy")
                .resolution("1920x1080")
                .description("Stunning nebula captured deep in outer space")
                .featured(true)
                .downloadCount(934L)
                .viewCount(4100L)
                .build(),

            Wallpaper.builder()
                .title("Cherry Blossom Path")
                .imageUrl("https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=70")
                .category("Nature")
                .tags("cherry blossom,spring,japan,pink,sakura,flowers")
                .resolution("1920x1080")
                .description("Magical cherry blossom lined walkway in spring")
                .featured(false)
                .downloadCount(445L)
                .viewCount(2100L)
                .build(),

            Wallpaper.builder()
                .title("Geometric Neon Grid")
                .imageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80")
                .thumbnailUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=70")
                .category("AI Art")
                .tags("geometric,neon,grid,tech,digital,futuristic,abstract")
                .resolution("1920x1080")
                .description("Futuristic neon geometric grid — perfect for tech setups")
                .featured(false)
                .downloadCount(698L)
                .viewCount(2900L)
                .build()
        );

        wallpaperRepository.saveAll(wallpapers);
        log.info("Seeded {} wallpapers successfully!", wallpapers.size());
    }
}
