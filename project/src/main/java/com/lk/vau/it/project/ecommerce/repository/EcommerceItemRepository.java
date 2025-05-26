package com.lk.vau.it.project.ecommerce.repository;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EcommerceItemRepository extends JpaRepository<EcommerceItem, Long> {

    // Find by category
    List<EcommerceItem> findByCategory(String category);

    // Find by category ignoring case
    List<EcommerceItem> findByCategoryIgnoreCase(String category);

    // Find by color
    List<EcommerceItem> findByColor(String color);

    // Find by size
    List<EcommerceItem> findBySize(String size);

    // Find by price range
    List<EcommerceItem> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Find by price less than or equal
    List<EcommerceItem> findByPriceLessThanEqual(BigDecimal maxPrice);

    // Find by price greater than or equal
    List<EcommerceItem> findByPriceGreaterThanEqual(BigDecimal minPrice);

    // Find items in stock
    List<EcommerceItem> findByStockGreaterThan(Integer stock);

    // Find out of stock items
    List<EcommerceItem> findByStockLessThanEqual(Integer stock);

    // Find by item name containing (case insensitive)
    List<EcommerceItem> findByItemNameContainingIgnoreCase(String itemName);

    // Find by category and color
    List<EcommerceItem> findByCategoryAndColor(String category, String color);

    // Find by category and size
    List<EcommerceItem> findByCategoryAndSize(String category, String size);

    // Find by multiple criteria
    List<EcommerceItem> findByCategoryAndColorAndSize(String category, String color, String size);

    // Custom query to find by category with stock availability
    @Query("SELECT e FROM EcommerceItem e WHERE e.category = :category AND e.stock > 0")
    List<EcommerceItem> findAvailableItemsByCategory(@Param("category") String category);

    // Custom query to find items by price range and category
    @Query("SELECT e FROM EcommerceItem e WHERE e.category = :category AND e.price BETWEEN :minPrice AND :maxPrice")
    List<EcommerceItem> findItemsByCategoryAndPriceRange(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    // Custom query for search functionality
    /* @Query("SELECT e FROM EcommerceItem e WHERE " +
            "LOWER(e.item_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.color) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<EcommerceItem> searchItems(@Param("searchTerm") String searchTerm);
 */
    // Find items with low stock (useful for inventory management)
    @Query("SELECT e FROM EcommerceItem e WHERE e.stock <= :threshold")
    List<EcommerceItem> findLowStockItems(@Param("threshold") Integer threshold);

    // Count items by category
    @Query("SELECT COUNT(e) FROM EcommerceItem e WHERE e.category = :category")
    Long countByCategory(@Param("category") String category);

    // Find distinct categories
    @Query("SELECT DISTINCT e.category FROM EcommerceItem e ORDER BY e.category")
    List<String> findDistinctCategories();

    // Find distinct colors
    @Query("SELECT DISTINCT e.color FROM EcommerceItem e ORDER BY e.color")
    List<String> findDistinctColors();

    // Find distinct sizes
    @Query("SELECT DISTINCT e.size FROM EcommerceItem e ORDER BY e.size")
    List<String> findDistinctSizes();
}