package com.wallpaper.app.service;

import com.wallpaper.app.model.Wallpaper;
import com.wallpaper.app.model.WallpaperDTO;
import com.wallpaper.app.model.WallpaperRequest;
import com.wallpaper.app.repository.WallpaperRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WallpaperService {

    private final WallpaperRepository wallpaperRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // ─── GET ALL (paginated, sorted, filtered) ───────────────────────────────

    public Page<WallpaperDTO> getWallpapers(String category, String search, String sort,
                                             int page, int size) {
        Sort sortOrder = buildSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<Wallpaper> result;

        if (search != null && !search.isBlank() && category != null && !category.isBlank()
                && !category.equalsIgnoreCase("all")) {
            result = wallpaperRepository.searchByQueryAndCategory(search.trim(), category.trim(), pageable);
        } else if (search != null && !search.isBlank()) {
            result = wallpaperRepository.searchWallpapers(search.trim(), pageable);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            result = wallpaperRepository.findByCategoryIgnoreCase(category.trim(), pageable);
        } else {
            result = wallpaperRepository.findAll(pageable);
        }

        return result.map(WallpaperDTO::fromEntity);
    }

    private Sort buildSort(String sort) {
        if (sort == null) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sort.toLowerCase()) {
            case "trending"  -> Sort.by(Sort.Direction.DESC, "viewCount");
            case "popular"   -> Sort.by(Sort.Direction.DESC, "downloadCount");
            case "oldest"    -> Sort.by(Sort.Direction.ASC,  "createdAt");
            default          -> Sort.by(Sort.Direction.DESC, "createdAt"); // "latest"
        };
    }

    // ─── GET ONE ────────────────────────────────────────────────────────────

    @Cacheable(value = "wallpaper", key = "#id")
    public Optional<WallpaperDTO> getWallpaperById(Long id) {
        return wallpaperRepository.findById(id).map(WallpaperDTO::fromEntity);
    }

    // ─── CREATE via URL ──────────────────────────────────────────────────────

    @CacheEvict(value = {"wallpapers", "categories"}, allEntries = true)
    public WallpaperDTO createWallpaper(WallpaperRequest request) {
        if (request.getImageUrl() == null || request.getImageUrl().isBlank()) {
            throw new IllegalArgumentException("imageUrl is required");
        }

        Wallpaper wallpaper = Wallpaper.builder()
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .thumbnailUrl(request.getThumbnailUrl() != null ? request.getThumbnailUrl() : request.getImageUrl())
                .category(request.getCategory())
                .tags(request.getTags())
                .resolution(request.getResolution())
                .description(request.getDescription())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .downloadCount(0L)
                .viewCount(0L)
                .build();

        return WallpaperDTO.fromEntity(wallpaperRepository.save(wallpaper));
    }

    // ─── CREATE via file upload ───────────────────────────────────────────────

    @CacheEvict(value = {"wallpapers", "categories"}, allEntries = true)
    public WallpaperDTO createWallpaperWithFile(WallpaperRequest request, MultipartFile file) throws IOException {
        String savedUrl = saveFile(file);

        Wallpaper wallpaper = Wallpaper.builder()
                .title(request.getTitle())
                .imageUrl(savedUrl)
                .thumbnailUrl(savedUrl)
                .category(request.getCategory())
                .tags(request.getTags())
                .resolution(request.getResolution())
                .description(request.getDescription())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .downloadCount(0L)
                .viewCount(0L)
                .build();

        return WallpaperDTO.fromEntity(wallpaperRepository.save(wallpaper));
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + ext;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return "/api/uploads/" + filename;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    @CacheEvict(value = {"wallpaper", "wallpapers", "categories"}, allEntries = true)
    public boolean deleteWallpaper(Long id) {
        if (!wallpaperRepository.existsById(id)) return false;

        Optional<Wallpaper> wallpaper = wallpaperRepository.findById(id);
        wallpaper.ifPresent(w -> {
            // If it's a local file, delete it
            if (w.getImageUrl().startsWith("/api/uploads/")) {
                String filename = w.getImageUrl().replace("/api/uploads/", "");
                Path filePath = Paths.get(uploadDir, filename);
                try { Files.deleteIfExists(filePath); } catch (IOException ignored) {}
            }
        });

        wallpaperRepository.deleteById(id);
        return true;
    }

    // ─── STATS ───────────────────────────────────────────────────────────────

    @Transactional
    public void trackDownload(Long id) {
        wallpaperRepository.incrementDownloadCount(id);
        // Evict single-item cache
        evictWallpaperCache(id);
    }

    @Transactional
    public void trackView(Long id) {
        wallpaperRepository.incrementViewCount(id);
        evictWallpaperCache(id);
    }

    @CacheEvict(value = "wallpaper", key = "#id")
    public void evictWallpaperCache(Long id) { /* annotation does the work */ }

    // ─── CATEGORIES ──────────────────────────────────────────────────────────

    @Cacheable("categories")
    public List<String> getCategories() {
        return wallpaperRepository.findAllCategories();
    }

    // ─── FEATURED ────────────────────────────────────────────────────────────

    public List<WallpaperDTO> getFeatured() {
        return wallpaperRepository.findByFeaturedTrue()
                .stream().map(WallpaperDTO::fromEntity).toList();
    }
}
