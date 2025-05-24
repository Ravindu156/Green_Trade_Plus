package com.lk.vau.it.project.trade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "tradeitems")
public class TradeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("farmer-tradeitem")
    private User farmer;

    @OneToMany(mappedBy = "item")
    private List<ItemBid> itemBids;

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

    // Constructor with all fields except id (for new entities)
    public TradeItem(User farmer, List<ItemBid> itemBids, String category, String name, Double quantity, 
                     String unit, Boolean isOrganic, String description, LocalDateTime dateAdded) {
        this.farmer = farmer;
        this.itemBids = itemBids;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = dateAdded;
    }

    // Constructor with required fields only
    public TradeItem(User farmer, String category, String name, Double quantity, String unit, Boolean isOrganic) {
        this.farmer = farmer;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
    }

    // Constructor with required fields and description
    public TradeItem(User farmer, String category, String name, Double quantity, String unit, Boolean isOrganic,
                     String description) {
        this.farmer = farmer;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
    }

    // Constructor with required fields, description, and dateAdded
    public TradeItem(User farmer, String category, String name, Double quantity, String unit, Boolean isOrganic,
                     String description, LocalDateTime dateAdded) {
        this.farmer = farmer;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = dateAdded;
    }

    // Constructor with all fields including id (for existing entities)
    public TradeItem(Long id, User farmer, List<ItemBid> itemBids, String category, String name, Double quantity,
                     String unit, Boolean isOrganic, String description, LocalDateTime dateAdded) {
        this.id = id;
        this.farmer = farmer;
        this.itemBids = itemBids;
        this.category = category;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.isOrganic = isOrganic;
        this.description = description;
        this.dateAdded = dateAdded;
    }

    @PrePersist
    protected void onCreate() {
        if (this.dateAdded == null) {
            this.dateAdded = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
    }

    public List<ItemBid> getItemBids() {
        return itemBids;
    }

    public void setItemBids(List<ItemBid> itemBids) {
        this.itemBids = itemBids;
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
        return "TradeItem{" +
                "id=" + id +
                ", user=" + (farmer != null ? farmer.getId() : null) +
                ", itemBids=" + (itemBids != null ? itemBids.size() + " bids" : "no bids") +
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