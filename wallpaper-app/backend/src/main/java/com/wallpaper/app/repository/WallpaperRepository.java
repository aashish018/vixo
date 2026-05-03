package com.wallpaper.app.repository;

import com.wallpaper.app.model.Wallpaper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WallpaperRepository extends JpaRepository<Wallpaper, Long> {

    // Find by category (case-insensitive)
    Page<Wallpaper> findByCategoryIgnoreCase(String category, Pageable pageable);

    // Search by title or tags
    @Query("SELECT w FROM Wallpaper w WHERE " +
           "LOWER(w.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.tags) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Wallpaper> searchWallpapers(@Param("query") String query, Pageable pageable);

    // Search by query + category
    @Query("SELECT w FROM Wallpaper w WHERE " +
           "(LOWER(w.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.tags) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "LOWER(w.category) = LOWER(:category)")
    Page<Wallpaper> searchByQueryAndCategory(@Param("query") String query,
                                             @Param("category") String category,
                                             Pageable pageable);

    // Get distinct categories
    @Query("SELECT DISTINCT w.category FROM Wallpaper w ORDER BY w.category")
    List<String> findAllCategories();

    // Increment download count
    @Modifying
    @Query("UPDATE Wallpaper w SET w.downloadCount = w.downloadCount + 1 WHERE w.id = :id")
    void incrementDownloadCount(@Param("id") Long id);

    // Increment view count
    @Modifying
    @Query("UPDATE Wallpaper w SET w.viewCount = w.viewCount + 1 WHERE w.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // Featured wallpapers
    List<Wallpaper> findByFeaturedTrue();

    // Count by category
    long countByCategoryIgnoreCase(String category);
}
