package com.wallpaper.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallpapers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wallpaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Image URL is required")
    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String thumbnailUrl;

    @Column(length = 255)
    private String publicId;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @Column(length = 500)
    private String tags;

    private String resolution;

    private String description;

    @Builder.Default
    private Long downloadCount = 0L;

    @Builder.Default
    private Long viewCount = 0L;

    @Builder.Default
    @Column(nullable = false)
    private Boolean featured = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (downloadCount == null) downloadCount = 0L;
        if (viewCount == null) viewCount = 0L;
        if (featured == null) featured = false;
        // Use imageUrl as thumbnail if thumbnailUrl not set
        if (thumbnailUrl == null || thumbnailUrl.isBlank()) {
            thumbnailUrl = imageUrl;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
