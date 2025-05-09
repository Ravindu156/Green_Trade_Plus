package com.lk.vau.it.project.trade.dto;

public class UserBasicInfoDto {
    private String userName;
    private String profile_photo_path;
    private String firstName;
    private String role;
    
    public UserBasicInfoDto(String userName, String profile_photo_path, String firstName, String role) {
        this.userName = userName;
        this.profile_photo_path = profile_photo_path;
        this.firstName = firstName;
        this.role = role;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProfilePhotoPath() {
        return profile_photo_path;
    }

    public void setProfilePhotoPath(String profile_photo_path) {
        this.profile_photo_path = profile_photo_path;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
