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
import java.util.Optional;

@Repository
public interface WallpaperRepository extends JpaRepository<Wallpaper, Long> {

    Page<Wallpaper> findByCategoryIgnoreCase(String category, Pageable pageable);

    @Query("SELECT w FROM Wallpaper w WHERE " +
           "LOWER(w.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(w.tags, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(w.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Wallpaper> searchWallpapers(@Param("query") String query, Pageable pageable);

    @Query("SELECT w FROM Wallpaper w WHERE " +
           "(LOWER(w.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(w.tags, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(w.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "LOWER(w.category) = LOWER(:category)")
    Page<Wallpaper> searchByQueryAndCategory(@Param("query") String query,
                                             @Param("category") String category,
                                             Pageable pageable);

    @Query("SELECT DISTINCT w.category FROM Wallpaper w ORDER BY w.category")
    List<String> findAllCategories();

    @Modifying
    @Query("UPDATE Wallpaper w SET w.downloadCount = w.downloadCount + 1, w.updatedAt = CURRENT_TIMESTAMP WHERE w.id = :id")
    int incrementDownloadCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Wallpaper w SET w.viewCount = w.viewCount + 1, w.updatedAt = CURRENT_TIMESTAMP WHERE w.id = :id")
    int incrementViewCount(@Param("id") Long id);

    List<Wallpaper> findTop8ByFeaturedTrueOrderByCreatedAtDesc();

    Optional<Wallpaper> findById(Long id);
}
