package com.lk.vau.it.project.trade.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lk.vau.it.project.trade.dto.AdminPriceSettingDto;
import com.lk.vau.it.project.trade.model.AdminPriceSetting;
import com.lk.vau.it.project.trade.repository.AdminPriceSettingRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminPriceSettingService {

    private final AdminPriceSettingRepository priceSettingRepository;

    @Autowired
    public AdminPriceSettingService(AdminPriceSettingRepository priceSettingRepository) {
        this.priceSettingRepository = priceSettingRepository;
    }

    /**
     * Create a new price setting
     */
    @Transactional
    public AdminPriceSettingDto createPriceSetting(AdminPriceSettingDto priceSettingDto, String adminUsername) {
        // Check if price setting already exists
        if (priceSettingRepository.existsByCategoryAndItemName(
                priceSettingDto.getCategory(), priceSettingDto.getItemName())) {
            throw new IllegalArgumentException("Price setting already exists for this category and item name");
        }

        AdminPriceSetting priceSetting = convertToEntity(priceSettingDto);
        priceSetting.setLastUpdated(LocalDateTime.now());
        priceSetting.setLastUpdatedBy(adminUsername);

        AdminPriceSetting savedPriceSetting = priceSettingRepository.save(priceSetting);
        return convertToDto(savedPriceSetting);
    }

    /**
     * Update an existing price setting
     */
    @Transactional
    public AdminPriceSettingDto updatePriceSetting(Long id, AdminPriceSettingDto priceSettingDto, String adminUsername) {
        AdminPriceSetting existingPriceSetting = priceSettingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Price setting not found with id: " + id));

        // If category or item name is being changed, check that the new combination doesn't already exist
        if (!existingPriceSetting.getCategory().equals(priceSettingDto.getCategory()) || 
            !existingPriceSetting.getItemName().equals(priceSettingDto.getItemName())) {
            
            if (priceSettingRepository.existsByCategoryAndItemName(
                    priceSettingDto.getCategory(), priceSettingDto.getItemName())) {
                throw new IllegalArgumentException("Price setting already exists for this category and item name");
            }
        }
        existingPriceSetting.setItemId(priceSettingDto.getItemId());
        existingPriceSetting.setCategory(priceSettingDto.getCategory());
        existingPriceSetting.setItemName(priceSettingDto.getItemName());
        existingPriceSetting.setPricePerUnit(priceSettingDto.getPricePerUnit());
        existingPriceSetting.setUnit(priceSettingDto.getUnit());
        existingPriceSetting.setLastUpdated(LocalDateTime.now());
        existingPriceSetting.setLastUpdatedBy(adminUsername);

        AdminPriceSetting updatedPriceSetting = priceSettingRepository.save(existingPriceSetting);
        return convertToDto(updatedPriceSetting);
    }

    /**
     * Get price setting by ID
     */
    public AdminPriceSettingDto getPriceSettingById(Long id) {
        AdminPriceSetting priceSetting = priceSettingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Price setting not found with id: " + id));
        return convertToDto(priceSetting);
    }

    /**
     * Get price setting by category and item name
     */
    public AdminPriceSettingDto getPriceSettingByCategoryAndItemName(String category, String itemName) {
        AdminPriceSetting priceSetting = priceSettingRepository.findByCategoryAndItemName(category, itemName)
                .orElseThrow(() -> new IllegalArgumentException("Price setting not found for category: " + 
                          category + " and item name: " + itemName));
        return convertToDto(priceSetting);
    }

    /**
     * Get all price settings
     */
    public List<AdminPriceSettingDto> getAllPriceSettings() {
        return priceSettingRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all price settings by category
     */
    public List<AdminPriceSettingDto> getAllPriceSettingsByCategory(String category) {
        return priceSettingRepository.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        return priceSettingRepository.findAllCategories();
    }

    /**
     * Get all item names by category
     */
    public List<String> getAllItemNamesByCategory(String category) {
        return priceSettingRepository.findAllItemNamesByCategory(category);
    }

    /**
     * Delete price setting by ID
     */
    @Transactional
    public void deletePriceSetting(Long id) {
        if (!priceSettingRepository.existsById(id)) {
            throw new IllegalArgumentException("Price setting not found with id: " + id);
        }
        priceSettingRepository.deleteById(id);
    }

    /**
     * Initialize predefined categories and items (to be used during application startup)
     */
    @Transactional
    public void initializePredefinedItems() {
        // Define categories and their items based on the provided React Native code
        Map<String, List<String>> itemsByCategory = Map.of(
            "vegetables", List.of("Carrot", "Tomato", "Potato", "Onion", "Spinach", "Broccoli", 
                "Bell Pepper", "Cucumber", "Zucchini", "Lettuce", "Cabbage", "Cauliflower", 
                "Eggplant", "Radish", "Green Beans", "Asparagus"),
            "fruits", List.of("Apple", "Banana", "Orange", "Grapes", "Strawberry", "Mango", 
                "Pineapple", "Watermelon", "Blueberry", "Kiwi", "Peach", "Pear", 
                "Cherry", "Plum", "Raspberry", "Lemon"),
            "grains", List.of("Rice", "Wheat", "Barley", "Oats", "Quinoa", "Corn", 
                "Millet", "Rye", "Buckwheat", "Amaranth", "Bulgur", "Farro"),
            "dairy", List.of("Milk", "Cheese", "Yogurt", "Butter", "Cream", "Cottage Cheese", 
                "Kefir", "Buttermilk", "Whey", "Ghee", "Paneer"),
            "herbs", List.of("Basil", "Parsley", "Cilantro", "Mint", "Rosemary", "Thyme", 
                "Oregano", "Sage", "Dill", "Chives", "Tarragon", "Lemongrass"),
            "nuts_seeds", List.of("Almonds", "Walnuts", "Cashews", "Peanuts", "Pistachios", 
                "Sunflower Seeds", "Pumpkin Seeds", "Chia Seeds", "Flax Seeds", 
                "Sesame Seeds", "Hazelnuts", "Pine Nuts")
        );

        // For each category and item, check if it exists and create if it doesn't
        itemsByCategory.forEach((category, items) -> {
            items.forEach(itemName -> {
                Optional<AdminPriceSetting> existingSetting = 
                    priceSettingRepository.findByCategoryAndItemName(category, itemName);
                
                if (existingSetting.isEmpty()) {
                    // Set default values for new items - these can be updated by admins later
                    AdminPriceSetting newSetting = new AdminPriceSetting();
                    newSetting.setCategory(category);
                    newSetting.setItemName(itemName);
                    newSetting.setPricePerUnit(java.math.BigDecimal.ZERO); // Default price
                    
                    // Set default unit based on category
                    if (category.equals("vegetables") || category.equals("fruits")) {
                        newSetting.setUnit("kg");
                    } else if (category.equals("dairy")) {
                        newSetting.setUnit("piece");
                    } else if (category.equals("herbs")) {
                        newSetting.setUnit("bunch");
                    } else if (category.equals("nuts_seeds")) {
                        newSetting.setUnit("g");
                    } else {
                        newSetting.setUnit("kg");
                    }
                    
                    newSetting.setLastUpdated(LocalDateTime.now());
                    newSetting.setLastUpdatedBy("system");
                    
                    priceSettingRepository.save(newSetting);
                }
            });
        });
    }

    /**
     * Convert entity to DTO
     */
    private AdminPriceSettingDto convertToDto(AdminPriceSetting priceSetting) {
        AdminPriceSettingDto dto = new AdminPriceSettingDto();
        dto.setId(priceSetting.getId());
        dto.setItemId(priceSetting.getItemId());
        dto.setCategory(priceSetting.getCategory());
        dto.setItemName(priceSetting.getItemName());
        dto.setPricePerUnit(priceSetting.getPricePerUnit());
        dto.setUnit(priceSetting.getUnit());
        dto.setLastUpdated(priceSetting.getLastUpdated());
        return dto;
    }

    /**
     * Convert DTO to entity
     */
    private AdminPriceSetting convertToEntity(AdminPriceSettingDto dto) {
        AdminPriceSetting entity = new AdminPriceSetting();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        entity.setItemId(dto.getItemId());
        entity.setCategory(dto.getCategory());
        entity.setItemName(dto.getItemName());
        entity.setPricePerUnit(dto.getPricePerUnit());
        entity.setUnit(dto.getUnit());
        entity.setLastUpdated(dto.getLastUpdated());
        return entity;
    }
}