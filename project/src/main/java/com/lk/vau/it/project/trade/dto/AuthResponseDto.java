package com.lk.vau.it.project.trade.dto;

public class AuthResponseDto {
    private Long id;
    private String token;
    private String userName;
    private String email;
    private String phoneNumber;
    private String role;
    private String profilePhotoPath;

    public AuthResponseDto(Long id, String token, String userName, String email, String phoneNumber, String role, String profilePhotoPath) {
        this.id = id;
        this.token = token;
        this.userName = userName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.profilePhotoPath = profilePhotoPath;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfilePhotoPath() {
        return profilePhotoPath;
    }

    public void setProfilePhotoPath(String profilePhotoPath) {
        this.profilePhotoPath = profilePhotoPath;
    }
}
