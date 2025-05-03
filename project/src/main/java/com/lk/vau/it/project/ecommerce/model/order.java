package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Entity;

@Entity(name = "Orders")
public class Order extends Item {
    private String order_id;
    private String buyer_name;
    private String buyer_NIC;
    private String buyer_address;
    private String buyer_email;
    private String buyer_phoneNo;


}
