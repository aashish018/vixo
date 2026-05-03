package com.wallpaper.app.config;

import com.wallpaper.app.model.Wallpaper;
import com.wallpaper.app.repository.WallpaperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final WallpaperRepository wallpaperRepository;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled || wallpaperRepository.count() > 0) {
            return;
        }

        List<Wallpaper> wallpapers = List.of(
                wallpaper("Misty Mountain Range", "Nature", "mountains,mist,landscape", true,
                        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"),
                wallpaper("Urban Night Drive", "Urban", "city,night,lights", true,
                        "https://res.cloudinary.com/demo/image/upload/v1690905142/cld-sample-5.jpg"),
                wallpaper("Minimal Geometry", "Minimal", "minimal,geometry,clean", false,
                        "https://res.cloudinary.com/demo/image/upload/v1690905141/cld-sample-2.jpg"),
                wallpaper("Deep Space Nebula", "Space", "space,nebula,stars", true,
                        "https://res.cloudinary.com/demo/image/upload/v1690905143/cld-sample.jpg")
        );

        wallpaperRepository.saveAll(wallpapers);
        log.info("Seeded {} wallpapers", wallpapers.size());
    }

    private Wallpaper wallpaper(String title, String category, String tags, boolean featured, String imageUrl) {
        return Wallpaper.builder()
                .title(title)
                .imageUrl(imageUrl)
                .thumbnailUrl(imageUrl)
                .category(category)
                .tags(tags)
                .featured(featured)
                .downloadCount(0L)
                .viewCount(0L)
                .build();
    }
}
