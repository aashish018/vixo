package com.wallpaper.app.service;

import com.wallpaper.app.exception.ResourceNotFoundException;
import com.wallpaper.app.model.Wallpaper;
import com.wallpaper.app.model.WallpaperDTO;
import com.wallpaper.app.model.WallpaperRequest;
import com.wallpaper.app.repository.WallpaperRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WallpaperService {

    private static final int MAX_PAGE_SIZE = 48;

    private final WallpaperRepository wallpaperRepository;
    private final CloudinaryService cloudinaryService;

    @Cacheable(
            value = "wallpapers",
            key = "T(java.lang.String).format('%s|%s|%s|%s|%s', #category, #search, #sort, #page, #size)"
    )
    public Page<WallpaperDTO> getWallpapers(String category, String search, String sort, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), normalizeSize(size), buildSort(sort));
        String normalizedCategory = normalize(category);
        String normalizedSearch = normalize(search);

        Page<Wallpaper> result;
        if (StringUtils.hasText(normalizedSearch) && StringUtils.hasText(normalizedCategory) && !"all".equalsIgnoreCase(normalizedCategory)) {
            result = wallpaperRepository.searchByQueryAndCategory(normalizedSearch, normalizedCategory, pageable);
        } else if (StringUtils.hasText(normalizedSearch)) {
            result = wallpaperRepository.searchWallpapers(normalizedSearch, pageable);
        } else if (StringUtils.hasText(normalizedCategory) && !"all".equalsIgnoreCase(normalizedCategory)) {
            result = wallpaperRepository.findByCategoryIgnoreCase(normalizedCategory, pageable);
        } else {
            result = wallpaperRepository.findAll(pageable);
        }

        return result.map(WallpaperDTO::fromEntity);
    }

    @Cacheable(value = "wallpaper", key = "#id")
    public WallpaperDTO getWallpaperById(Long id) {
        return wallpaperRepository.findById(id)
                .map(WallpaperDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Wallpaper not found for id " + id));
    }

    @Cacheable("categories")
    public List<String> getCategories() {
        return wallpaperRepository.findAllCategories();
    }

    @Cacheable("featuredWallpapers")
    public List<WallpaperDTO> getFeatured() {
        return wallpaperRepository.findTop8ByFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(WallpaperDTO::fromEntity)
                .toList();
    }

    @Transactional
    @CacheEvict(value = {"wallpapers", "categories", "featuredWallpapers"}, allEntries = true)
    public WallpaperDTO createWallpaper(WallpaperRequest request) {
        CloudinaryService.CloudinaryUploadResult uploadResult = cloudinaryService.upload(request.getImageUrl());
        Wallpaper wallpaper = wallpaperRepository.save(buildWallpaper(request, uploadResult));
        return WallpaperDTO.fromEntity(wallpaper);
    }

    @Transactional
    @CacheEvict(value = {"wallpapers", "categories", "featuredWallpapers"}, allEntries = true)
    public WallpaperDTO createWallpaperWithFile(WallpaperRequest request, MultipartFile file) {
        CloudinaryService.CloudinaryUploadResult uploadResult = cloudinaryService.upload(file);
        Wallpaper wallpaper = wallpaperRepository.save(buildWallpaper(request, uploadResult));
        return WallpaperDTO.fromEntity(wallpaper);
    }

    @Transactional
    @CacheEvict(value = {"wallpaper", "wallpapers", "categories", "featuredWallpapers"}, allEntries = true)
    public void deleteWallpaper(Long id) {
        Wallpaper wallpaper = wallpaperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallpaper not found for id " + id));
        cloudinaryService.delete(wallpaper.getPublicId());
        wallpaperRepository.delete(wallpaper);
    }

    @Transactional
    public String trackDownload(Long id) {
        int updated = wallpaperRepository.incrementDownloadCount(id);
        if (updated == 0) {
            throw new ResourceNotFoundException("Wallpaper not found for id " + id);
        }
        evictWallpaperCache(id);
        return getWallpaperById(id).getImageUrl();
    }

    @Transactional
    public void trackView(Long id) {
        int updated = wallpaperRepository.incrementViewCount(id);
        if (updated == 0) {
            throw new ResourceNotFoundException("Wallpaper not found for id " + id);
        }
        evictWallpaperCache(id);
    }

    @CacheEvict(value = "wallpaper", key = "#id")
    public void evictWallpaperCache(Long id) {
    }

    private Wallpaper buildWallpaper(WallpaperRequest request, CloudinaryService.CloudinaryUploadResult uploadResult) {
        return Wallpaper.builder()
                .title(normalize(request.getTitle()))
                .imageUrl(uploadResult.imageUrl())
                .thumbnailUrl(uploadResult.thumbnailUrl())
                .publicId(uploadResult.publicId())
                .category(normalize(request.getCategory()))
                .tags(normalize(request.getTags()))
                .resolution(normalize(request.getResolution()))
                .description(normalize(request.getDescription()))
                .featured(Boolean.TRUE.equals(request.getFeatured()))
                .downloadCount(0L)
                .viewCount(0L)
                .build();
    }

    private Sort buildSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort.toLowerCase()) {
            case "trending" -> Sort.by(Sort.Direction.DESC, "viewCount").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "popular" -> Sort.by(Sort.Direction.DESC, "downloadCount").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return 12;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}
