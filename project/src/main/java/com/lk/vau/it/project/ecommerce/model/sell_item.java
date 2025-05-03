package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Column;

public class sell_item extends item{
    private String seller_id;
    private int stock;

    @Column(length = 1000)
    private String description;



    
    
}
