package com.lk.vau.it.project.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String first_name;

    @Column(nullable = false)
    private String last_name;

    @Column(nullable = false)
    private String user_name;
    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String gender;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String address_line_one;

    @Column(nullable = false)
    private String address_line_two;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, unique = true)
    private String phone_number;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getFirstName() {
        return first_name;
    }
    
    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }
    
    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public String getUserName() {
        return user_name;
    }
    
    public void setUserName(String user_name) {
        this.user_name = user_name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddressLineOne() {
        return address_line_one;
    }
    
    public void setAddressLineOne(String address_line_one) {
        this.address_line_one = address_line_one;
    }

    public String getAddressLineTwo() {
        return address_line_two;
    }
    
    public void setAddressLineTwo(String address_line_two) {
        this.address_line_two = address_line_two;
    }

    public String getProvince() {
        return province;
    }
    
    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }
    
    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }

    public String getPhoneNumber() {
        return phone_number;
    }
    
    public void setPhoneNumber(String phone_number) {
        this.phone_number = phone_number;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
