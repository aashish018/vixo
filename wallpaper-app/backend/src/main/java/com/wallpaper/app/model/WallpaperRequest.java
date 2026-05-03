package com.wallpaper.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WallpaperRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title must be at most 120 characters")
    private String title;

    @NotBlank(message = "Image URL is required")
    @Pattern(
            regexp = "^(https?://).+",
            message = "Image URL must be a valid http or https URL"
    )
    private String imageUrl;

    @NotBlank(message = "Category is required")
    @Size(max = 80, message = "Category must be at most 80 characters")
    private String category;

    @Size(max = 500, message = "Tags must be at most 500 characters")
    private String tags;

    @Size(max = 40, message = "Resolution must be at most 40 characters")
    private String resolution;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    private Boolean featured = false;
}
