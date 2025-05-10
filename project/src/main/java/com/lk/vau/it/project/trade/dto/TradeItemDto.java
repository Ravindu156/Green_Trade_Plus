package com.lk.vau.it.project.trade.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TradeItemDto {
    private Long id;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Organic status is required")
    private Boolean isOrganic;

    
    private String description;
    private LocalDateTime dateAdded;
    
    // Default constructor
    public TradeItemDto() {
    }
    
    // Constructor with fields
    public TradeItemDto(String category, String name, Double quantity, String unit, Boolean isOrganic, String description) {
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = LocalDateTime.now();
    }
    
    // Constructor for mapping from entity
    public TradeItemDto(Long id, String category, String name, Double quantity, String unit, Boolean isOrganic, String description, LocalDateTime dateAdded) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = dateAdded;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Double getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }
    
    public Boolean getIsOrganic() {
        return isOrganic;
    }
    
    public void setIsOrganic(Boolean isOrganic) {
        this.isOrganic = isOrganic;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getDateAdded() {
        return dateAdded;
    }
    
    public void setDateAdded(LocalDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }
}
