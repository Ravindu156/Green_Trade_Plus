package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Id;

public class Seller {
    @Id
    private String seller_id;
    private String seller_name;
    private String seller_NIC;
    private String seller_address;
    private String seller_email;
    private String seller_phoneNo;
}
