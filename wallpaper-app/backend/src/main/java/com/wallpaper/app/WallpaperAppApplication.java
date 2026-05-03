package com.wallpaper.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class WallpaperAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(WallpaperAppApplication.class, args);
    }
}
