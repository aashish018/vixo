package com.wallpaper.app;

import com.wallpaper.app.config.CloudinaryProperties;
import com.wallpaper.app.config.RateLimitProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableConfigurationProperties({CloudinaryProperties.class, RateLimitProperties.class})
public class WallpaperAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(WallpaperAppApplication.class, args);
    }
}
