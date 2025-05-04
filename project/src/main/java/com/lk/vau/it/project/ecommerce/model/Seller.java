package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class Seller {
    @Id
    private String seller_id;
    private String seller_name;
    private String seller_NIC;
    private String seller_address;
    private String seller_email;
    private String seller_phoneNo;

    public String getSeller_id() {
        return seller_id;
    }
    public void setSeller_id(String seller_id) {
        this.seller_id = seller_id;
    }
    public String getSeller_name() {
        return seller_name;
    }
    public void setSeller_name(String seller_name) {
        this.seller_name = seller_name;
    }
    public String getSeller_NIC() {
        return seller_NIC;
    }
    public void setSeller_NIC(String seller_NIC) {
        this.seller_NIC = seller_NIC;
    }
    public String getSeller_address() {
        return seller_address;
    }
    public void setSeller_address(String seller_address) {
        this.seller_address = seller_address;
    }
    public String getSeller_email() {
        return seller_email;
    }
    public void setSeller_email(String seller_email) {
        this.seller_email = seller_email;
    }
    public String getSeller_phoneNo() {
        return seller_phoneNo;
    }
    public void setSeller_phoneNo(String seller_phoneNo) {
        this.seller_phoneNo = seller_phoneNo;
    }

    
}
