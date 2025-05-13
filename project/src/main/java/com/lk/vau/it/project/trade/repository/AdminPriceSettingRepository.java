package com.lk.vau.it.project.trade.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lk.vau.it.project.trade.model.AdminPriceSetting;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminPriceSettingRepository extends JpaRepository<AdminPriceSetting, Long> {

    /**
     * Find price setting by category and item name
     */
    Optional<AdminPriceSetting> findByCategoryAndItemName(String category, String itemName);
    
    /**
     * Find all price settings for a specific category
     */
    List<AdminPriceSetting> findByCategory(String category);
    
    /**
     * Check if a price setting exists for a specific category and item name
     */
    boolean existsByCategoryAndItemName(String category, String itemName);
    
    /**
     * Get all distinct categories
     */
    @Query("SELECT DISTINCT a.category FROM AdminPriceSetting a")
    List<String> findAllCategories();
    
    /**
     * Get all items for a specific category
     */
    @Query("SELECT a.itemName FROM AdminPriceSetting a WHERE a.category = ?1")
    List<String> findAllItemNamesByCategory(String category);
}