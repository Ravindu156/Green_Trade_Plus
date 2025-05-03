package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Column;

public class SellItem extends Item{
    private String seller_id;
    private int stock;

    @Column(length = 1000)
    private String description;

    public String getSeller_id() {
        return seller_id;
    }

    public void setSeller_id(String seller_id) {
        this.seller_id = seller_id;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    

    
    
}
