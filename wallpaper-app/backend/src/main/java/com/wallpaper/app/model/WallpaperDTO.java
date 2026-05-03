package com.wallpaper.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WallpaperDTO {
    private Long id;
    private String title;
    private String imageUrl;
    private String thumbnailUrl;
    private String category;
    private String tags;
    private String resolution;
    private String description;
    private Long downloadCount;
    private Long viewCount;
    private Boolean featured;
    private LocalDateTime createdAt;

    public static WallpaperDTO fromEntity(Wallpaper w) {
        return WallpaperDTO.builder()
                .id(w.getId())
                .title(w.getTitle())
                .imageUrl(w.getImageUrl())
                .thumbnailUrl(w.getThumbnailUrl() != null ? w.getThumbnailUrl() : w.getImageUrl())
                .category(w.getCategory())
                .tags(w.getTags())
                .resolution(w.getResolution())
                .description(w.getDescription())
                .downloadCount(w.getDownloadCount())
                .viewCount(w.getViewCount())
                .featured(w.getFeatured())
                .createdAt(w.getCreatedAt())
                .build();
    }
}
