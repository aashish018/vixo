package com.wallpaper.app.controller;

import com.wallpaper.app.model.WallpaperDTO;
import com.wallpaper.app.model.WallpaperRequest;
import com.wallpaper.app.service.WallpaperService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallpapers")
@RequiredArgsConstructor
@Slf4j
public class WallpaperController {

    private final WallpaperService wallpaperService;

    // ─── GET ALL ─────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<Map<String, Object>> getWallpapers(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Page<WallpaperDTO> wallpapers = wallpaperService.getWallpapers(category, search, sort, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", wallpapers.getContent());
        response.put("currentPage", wallpapers.getNumber());
        response.put("totalItems", wallpapers.getTotalElements());
        response.put("totalPages", wallpapers.getTotalPages());
        response.put("hasNext", wallpapers.hasNext());
        response.put("hasPrevious", wallpapers.hasPrevious());

        return ResponseEntity.ok(response);
    }

    // ─── GET ONE ─────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<WallpaperDTO> getWallpaper(@PathVariable Long id) {
        wallpaperService.trackView(id);
        return wallpaperService.getWallpaperById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── CREATE VIA URL ──────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createWallpaper(@Valid @RequestBody WallpaperRequest request) {
        try {
            WallpaperDTO created = wallpaperService.createWallpaper(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── CREATE VIA FILE UPLOAD ───────────────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<?> uploadWallpaper(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "resolution", required = false) String resolution,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "featured", defaultValue = "false") Boolean featured) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        WallpaperRequest request = new WallpaperRequest();
        request.setTitle(title);
        request.setCategory(category);
        request.setTags(tags);
        request.setResolution(resolution);
        request.setDescription(description);
        request.setFeatured(featured);

        try {
            WallpaperDTO created = wallpaperService.createWallpaperWithFile(request, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IOException e) {
            log.error("File upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWallpaper(@PathVariable Long id) {
        boolean deleted = wallpaperService.deleteWallpaper(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Wallpaper deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // ─── TRACK DOWNLOAD ───────────────────────────────────────────────────────
    @PostMapping("/{id}/download")
    public ResponseEntity<?> trackDownload(@PathVariable Long id) {
        wallpaperService.trackDownload(id);
        return wallpaperService.getWallpaperById(id)
                .map(w -> ResponseEntity.ok(Map.of("imageUrl", w.getImageUrl())))
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── GET CATEGORIES ──────────────────────────────────────────────────────
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(wallpaperService.getCategories());
    }

    // ─── GET FEATURED ────────────────────────────────────────────────────────
    @GetMapping("/featured")
    public ResponseEntity<List<WallpaperDTO>> getFeatured() {
        return ResponseEntity.ok(wallpaperService.getFeatured());
    }
}
