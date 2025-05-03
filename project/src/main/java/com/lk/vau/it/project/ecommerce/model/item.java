package com.lk.vau.it.project.ecommerce.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;

public class item {
    private String item_name;

    @Lob
    private byte[] image;

    private String size;
    private String color;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    
}
