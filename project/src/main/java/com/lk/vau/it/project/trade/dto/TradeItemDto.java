package com.lk.vau.it.project.trade.dto;

import java.time.LocalDateTime;

import com.lk.vau.it.project.trade.model.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TradeItemDto {
    private Long id;

    private User user;

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

    private Boolean isBidActive = true; // Default value

    // Default constructor
    public TradeItemDto() {
        this.isBidActive = true;
    }

    // Constructor with fields
    public TradeItemDto(User user, String category, String name, Double quantity, String unit, Boolean isOrganic, String description) {
        this.user = user;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = LocalDateTime.now();
        this.isBidActive = true;
    }

    // Constructor for mapping from entity
    public TradeItemDto(Long id, User user, String category, String name, Double quantity, String unit, Boolean isOrganic,
                        String description, LocalDateTime dateAdded, Boolean isBidActive) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = dateAdded;
        this.isBidActive = isBidActive;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Boolean getIsBidActive() {
        return isBidActive;
    }

    public void setIsBidActive(Boolean isBidActive) {
        this.isBidActive = isBidActive;
    }
}
