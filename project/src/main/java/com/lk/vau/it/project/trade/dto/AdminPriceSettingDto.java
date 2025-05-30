package com.lk.vau.it.project.trade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPriceSettingDto {

    private Long id;

    private Long itemId;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price must be positive")
    private BigDecimal pricePerUnit;
    
    private String unit;

    private LocalDateTime lastUpdated;
    
    // Constructors
    public AdminPriceSettingDto() {
    }
    
    public AdminPriceSettingDto(Long itemId, String category, String itemName, BigDecimal pricePerUnit, String unit, LocalDateTime lastUpdated) {
        this.itemId = itemId;
        this.category = category;
        this.itemName = itemName;
        this.pricePerUnit = pricePerUnit;
        this.unit = unit;
        this.lastUpdated = lastUpdated;
    }
    
    // For updating existing records
    public AdminPriceSettingDto(Long id, Long itemId, String category, String itemName, BigDecimal pricePerUnit, String unit, LocalDateTime lastUpdated) {
        this.id = id;
        this.itemId = itemId;
        this.category = category;
        this.itemName = itemName;
        this.pricePerUnit = pricePerUnit;
        this.unit = unit;
        this.lastUpdated = lastUpdated;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }
    
    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getItemName() {
        return itemName;
    }
    
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    
    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }
    
    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    @Override
    public String toString() {
        return "AdminPriceSettingDto{" +
                "id=" + id +
                ", itemId='" + itemId + '\'' +
                ", category='" + category + '\'' +
                ", itemName='" + itemName + '\'' +
                ", pricePerUnit=" + pricePerUnit +
                ", unit='" + unit + '\'' +
                ", lastUpdated='" + lastUpdated + '\'' +
                '}';
    }
}