package com.lk.vau.it.project.ecommerce.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "Orders")
public class EcommerceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String order_id;
    private String user_id;
    private String user_address;
    private String user_email;
    private String user_phoneNo;
    
    public String getOrder_id() {
        return order_id;
    }
    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }
    public String getUser_id() {
        return user_id;
    }
    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }
    public String getUser_address() {
        return user_address;
    }
    public void setUser_address(String user_address) {
        this.user_address = user_address;
    }
    public String getUser_email() {
        return user_email;
    }
    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }
    public String getUser_phoneNo() {
        return user_phoneNo;
    }
    public void setUser_phoneNo(String user_phoneNo) {
        this.user_phoneNo = user_phoneNo;
    }

    

}
