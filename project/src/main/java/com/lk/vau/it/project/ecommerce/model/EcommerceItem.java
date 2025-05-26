package com.lk.vau.it.project.ecommerce.model;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.lk.vau.it.project.trade.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class EcommerceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long item_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("seller-item")
    private User seller;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String itemName;

    // Array of product photo URLs (up to 5 photos)
    @ElementCollection
    @Size(max = 5, message = "Maximum 5 product photos allowed")
    @Column(name = "product_photo_url")
    private List<String> productPhotoUrls;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    // Changed from char to String to match frontend options (XS, S, M, L, XL)
    private String size;
    
    @NotBlank(message = "Color is required")
    private String color;
    
    // Size chart image URL
    private String sizeChartImageUrl;
    
    // Product description
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    // Default constructor
    public EcommerceItem() {}

    // Constructor with essential fields
    public EcommerceItem(User seller, String itemName, String category, Integer stock, 
                        String size, String color, BigDecimal price) {
        this.seller = seller;
        this.itemName = itemName;
        this.category = category;
        this.stock = stock;
        this.size = size;
        this.color = color;
        this.price = price;
    }

    // Getters and Setters
    public Long getItem_id() {
        return item_id;
    }

    public void setItem_id(Long item_id) {
        this.item_id = item_id;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public String getitemName() {
        return itemName;
    }

    public void setitemName(String itemName) {
        this.itemName = itemName;
    }

    public List<String> getProductPhotoUrls() {
        return productPhotoUrls;
    }

    public void setProductPhotoUrls(List<String> productPhotoUrls) {
        this.productPhotoUrls = productPhotoUrls;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSizeChartImageUrl() {
        return sizeChartImageUrl;
    }

    public void setSizeChartImageUrl(String sizeChartImageUrl) {
        this.sizeChartImageUrl = sizeChartImageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    // Utility methods
    public void addProductPhotoUrl(String photoUrl) {
        if (this.productPhotoUrls != null && this.productPhotoUrls.size() < 5) {
            this.productPhotoUrls.add(photoUrl);
        }
    }

    public void removeProductPhotoUrl(String photoUrl) {
        if (this.productPhotoUrls != null) {
            this.productPhotoUrls.remove(photoUrl);
        }
    }

    public boolean hasMaxPhotos() {
        return this.productPhotoUrls != null && this.productPhotoUrls.size() >= 5;
    }

    public int getPhotoCount() {
        return this.productPhotoUrls != null ? this.productPhotoUrls.size() : 0;
    }

    @Override
    public String toString() {
        return "EcommerceItem{" +
                "item_id=" + item_id +
                ", seller='" + seller + '\'' +
                ", itemName='" + itemName + '\'' +
                ", category='" + category + '\'' +
                ", stock=" + stock +
                ", size='" + size + '\'' +
                ", color='" + color + '\'' +
                ", price=" + price +
                ", photoCount=" + getPhotoCount() +
                '}';
    }
}