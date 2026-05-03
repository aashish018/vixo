package com.wallpaper.app.controller;

import com.wallpaper.app.model.PagedResponse;
import com.wallpaper.app.model.WallpaperDTO;
import com.wallpaper.app.model.WallpaperRequest;
import com.wallpaper.app.service.WallpaperService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@Validated
@RequestMapping("/api/wallpapers")
@RequiredArgsConstructor
public class WallpaperController {

    private final WallpaperService wallpaperService;

    @GetMapping
    public ResponseEntity<PagedResponse<WallpaperDTO>> getWallpapers(
            @RequestParam(required = false) @Size(max = 80) String category,
            @RequestParam(required = false) @Size(max = 120) String search,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "12") @Min(1) @Max(48) int size
    ) {
        return ResponseEntity.ok(PagedResponse.from(
                wallpaperService.getWallpapers(category, search, sort, page, size)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WallpaperDTO> getWallpaper(@PathVariable Long id) {
        wallpaperService.trackView(id);
        return ResponseEntity.ok(wallpaperService.getWallpaperById(id));
    }

    @PostMapping
    public ResponseEntity<WallpaperDTO> createWallpaper(@Valid @RequestBody WallpaperRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wallpaperService.createWallpaper(request));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WallpaperDTO> uploadWallpaper(
            @RequestPart("file") MultipartFile file,
            @RequestParam("title") @Size(min = 1, max = 120) String title,
            @RequestParam("category") @Size(min = 1, max = 80) String category,
            @RequestParam(value = "tags", required = false) @Size(max = 500) String tags,
            @RequestParam(value = "resolution", required = false) @Size(max = 40) String resolution,
            @RequestParam(value = "description", required = false) @Size(max = 500) String description,
            @RequestParam(value = "featured", defaultValue = "false") Boolean featured
    ) {
        validateFile(file);
        WallpaperRequest request = new WallpaperRequest(title, "uploaded-file", category, tags, resolution, description, featured);
        return ResponseEntity.status(HttpStatus.CREATED).body(wallpaperService.createWallpaperWithFile(request, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteWallpaper(@PathVariable Long id) {
        wallpaperService.deleteWallpaper(id);
        return ResponseEntity.ok(Map.of("message", "Wallpaper deleted successfully"));
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<Map<String, String>> trackDownload(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("imageUrl", wallpaperService.trackDownload(id)));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(wallpaperService.getCategories());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<WallpaperDTO>> getFeatured() {
        return ResponseEntity.ok(wallpaperService.getFeatured());
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
    }
}
