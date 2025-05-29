package com.lk.vau.it.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${app.profile.photo.upload.dir:profile-photos}")
    private String profilePhotoUploadDir;
    
    @Value("${app.course.thumbnail.upload.dir:course-thumbnails}")
    private String courseThumbnailUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve profile photos
        registry.addResourceHandler("/uploads/profile-photos/**")
                .addResourceLocations("file:" + profilePhotoUploadDir + "/");
        
        // Serve course thumbnails
        registry.addResourceHandler("/uploads/course-thumbnails/**")
                .addResourceLocations("file:" + courseThumbnailUploadDir + "/");
    }
}