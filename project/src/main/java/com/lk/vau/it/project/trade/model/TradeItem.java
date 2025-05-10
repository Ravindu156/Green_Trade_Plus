package com.lk.vau.it.project.trade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tradeitems")
public class TradeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double quantity;
    
    @Column(nullable = false)
    private String unit;
    
    @Column(nullable = false)
    private Boolean isOrganic;
    
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime dateAdded;
    
    // Default constructor
    public TradeItem() {
    }
    
    // Constructor with fields
    public TradeItem(String category, String name, Double quantity, String unit, Boolean isOrganic, String description, LocalDateTime dateAdded) {
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
    
    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", category='" + category + '\'' +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", isOrganic=" + isOrganic +
                ", description='" + description + '\'' +
                ", dateAdded=" + dateAdded +
                '}';
    }
}
