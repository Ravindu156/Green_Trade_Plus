package com.lk.vau.it.project.trade.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_price_settings", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"category", "itemName"}))
public class AdminPriceSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Item name is required")
    @Column(nullable = false)
    private String itemName;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private BigDecimal pricePerUnit;

    @Column(nullable = false)
    private String unit;

    private LocalDateTime lastUpdated;

    private String lastUpdatedBy;

    // Constructors
    public AdminPriceSetting() {
    }

    public AdminPriceSetting(String category, String itemName, BigDecimal pricePerUnit, String unit) {
        this.category = category;
        this.itemName = itemName;
        this.pricePerUnit = pricePerUnit;
        this.unit = unit;
        this.lastUpdated = LocalDateTime.now();
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

    public String getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    public void setLastUpdatedBy(String lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    @Override
    public String toString() {
        return "AdminPriceSetting{" +
                "id=" + id +
                ", category='" + category + '\'' +
                ", itemName='" + itemName + '\'' +
                ", pricePerUnit=" + pricePerUnit +
                ", unit='" + unit + '\'' +
                ", lastUpdated=" + lastUpdated +
                ", lastUpdatedBy='" + lastUpdatedBy + '\'' +
                '}';
    }
}