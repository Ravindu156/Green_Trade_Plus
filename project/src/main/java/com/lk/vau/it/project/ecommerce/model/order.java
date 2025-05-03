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
    
    public String getOrder_id() {
        return order_id;
    }
    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }
    public String getBuyer_name() {
        return buyer_name;
    }
    public void setBuyer_name(String buyer_name) {
        this.buyer_name = buyer_name;
    }
    public String getBuyer_NIC() {
        return buyer_NIC;
    }
    public void setBuyer_NIC(String buyer_NIC) {
        this.buyer_NIC = buyer_NIC;
    }
    public String getBuyer_address() {
        return buyer_address;
    }
    public void setBuyer_address(String buyer_address) {
        this.buyer_address = buyer_address;
    }
    public String getBuyer_email() {
        return buyer_email;
    }
    public void setBuyer_email(String buyer_email) {
        this.buyer_email = buyer_email;
    }
    public String getBuyer_phoneNo() {
        return buyer_phoneNo;
    }
    public void setBuyer_phoneNo(String buyer_phoneNo) {
        this.buyer_phoneNo = buyer_phoneNo;
    }

    

}
