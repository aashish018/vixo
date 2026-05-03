package com.wallpaper.app.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary(CloudinaryProperties properties) {
        if (!StringUtils.hasText(properties.cloudName())
                || !StringUtils.hasText(properties.apiKey())
                || !StringUtils.hasText(properties.apiSecret())) {
            throw new IllegalStateException("Cloudinary credentials are not configured");
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", properties.cloudName());
        config.put("api_key", properties.apiKey());
        config.put("api_secret", properties.apiSecret());
        config.put("secure", "true");
        return new Cloudinary(config);
    }
}
