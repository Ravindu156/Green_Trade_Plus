package com.lk.vau.it.project.trade.dto;

public class UserBasicInfoDto {
    private String userName;
    private String profilePhotoPath;
    
    public UserBasicInfoDto(String userName, String profilePhotoPath) {
        this.userName = userName;
        this.profilePhotoPath = profilePhotoPath;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProfilePhotoPath() {
        return profilePhotoPath;
    }

    public void setProfilePhotoPath(String profilePhotoPath) {
        this.profilePhotoPath = profilePhotoPath;
    }
    
}
