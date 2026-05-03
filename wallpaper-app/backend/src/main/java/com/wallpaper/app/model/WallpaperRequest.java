package com.wallpaper.app.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WallpaperRequest {

    @NotBlank(message = "Title is required")
    private String title;

    // Either imageUrl OR file upload will be used
    private String imageUrl;

    private String thumbnailUrl;

    @NotBlank(message = "Category is required")
    private String category;

    private String tags;

    private String resolution;

    private String description;

    private Boolean featured = false;
}
