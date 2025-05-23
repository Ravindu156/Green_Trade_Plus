package com.lk.vau.it.project.academy.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.lk.vau.it.project.academy.model.AcademyCourse;
import com.lk.vau.it.project.trade.dto.UserBasicInfoDto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AcademyCourseDto {
    
    private Long id;
    
    @NotBlank(message = "Course title is required")
    @Size(max = 255, message = "Course title must be less than 255 characters")
    private String courseTitle;
    
    @NotBlank(message = "Course description is required")
    @Size(max = 5000, message = "Course description must be less than 5000 characters")
    private String courseDescription;
    
    @NotNull(message = "Course fee is required")
    @Min(value = 0, message = "Course fee cannot be negative")
    private Double courseFees;
    
    @NotBlank(message = "Course video URL is required")
    private String courseVideo;
    
    private String courseThumbnail;
    
    private List<String> suitableFor = new ArrayList<>();
    
    // For checkboxes in form submission
    private boolean forFarmers;
    private boolean forSellers;
    private boolean forBuyers;
    
    private Long tutorId;
    private UserBasicInfoDto tutor;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive = true;
    private Integer enrollmentCount = 0;
    private Double averageRating = 0.0;
    
    // Default constructor
    public AcademyCourseDto() {
    }
    
    // Constructor to convert Entity to DTO
    public AcademyCourseDto(AcademyCourse course) {
        this.id = course.getId();
        this.courseTitle = course.getCourseTitle();
        this.courseDescription = course.getCourseDescription();
        this.courseFees = course.getCourseFees();
        this.courseVideo = course.getCourseVideo();
        this.courseThumbnail = course.getCourseThumbnail();
        this.suitableFor = course.getSuitableFor();
        
        // Set checkbox values based on suitableFor list
        if (suitableFor != null) {
            this.forFarmers = suitableFor.contains("For Farmers");
            this.forSellers = suitableFor.contains("For Sellers");
            this.forBuyers = suitableFor.contains("For Buyers");
        }
        
        // I comment following code because we still not intergrate user model with the course
        /* if (course.getTutor() != null) {
            this.tutorId = course.getTutor().getId();
            this.tutor = new UserBasicInfoDto(course.getTutor());
        } */
        
        this.createdAt = course.getCreatedAt();
        this.updatedAt = course.getUpdatedAt();
        this.isActive = course.getIsActive();
        this.enrollmentCount = course.getEnrollmentCount();
        this.averageRating = course.getAverageRating();
    }
    
    // Method to convert DTO to Entity for saving
    public AcademyCourse toEntity() {
        AcademyCourse course = new AcademyCourse();
        course.setCourseTitle(this.courseTitle);
        course.setCourseDescription(this.courseDescription);
        course.setCourseFees(this.courseFees);
        course.setCourseVideo(this.courseVideo);
        course.setCourseThumbnail(this.courseThumbnail);
        
        // Create suitableFor list from checkbox values
        List<String> suitable = new ArrayList<>();
        if (this.forFarmers) suitable.add("For Farmers");
        if (this.forSellers) suitable.add("For Sellers");
        if (this.forBuyers) suitable.add("For Buyers");
        course.setSuitableFor(suitable);
        
        return course;
    }
    
    // Update an existing entity with DTO values
    public void updateEntity(AcademyCourse course) {
        course.setCourseTitle(this.courseTitle);
        course.setCourseDescription(this.courseDescription);
        course.setCourseFees(this.courseFees);
        course.setCourseVideo(this.courseVideo);
        
        // Only update thumbnail if a new one is provided
        if (this.courseThumbnail != null && !this.courseThumbnail.isEmpty()) {
            course.setCourseThumbnail(this.courseThumbnail);
        }
        
        // Create suitableFor list from checkbox values
        List<String> suitable = new ArrayList<>();
        if (this.forFarmers) suitable.add("For Farmers");
        if (this.forSellers) suitable.add("For Sellers");
        if (this.forBuyers) suitable.add("For Buyers");
        course.setSuitableFor(suitable);
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public Double getCourseFees() {
        return courseFees;
    }

    public void setCourseFees(Double courseFees) {
        this.courseFees = courseFees;
    }

    public String getCourseVideo() {
        return courseVideo;
    }

    public void setCourseVideo(String courseVideo) {
        this.courseVideo = courseVideo;
    }

    public String getCourseThumbnail() {
        return courseThumbnail;
    }

    public void setCourseThumbnail(String courseThumbnail) {
        this.courseThumbnail = courseThumbnail;
    }

    public List<String> getSuitableFor() {
        return suitableFor;
    }

    public void setSuitableFor(List<String> suitableFor) {
        this.suitableFor = suitableFor;
    }

    public boolean isForFarmers() {
        return forFarmers;
    }

    public void setForFarmers(boolean forFarmers) {
        this.forFarmers = forFarmers;
    }

    public boolean isForSellers() {
        return forSellers;
    }

    public void setForSellers(boolean forSellers) {
        this.forSellers = forSellers;
    }

    public boolean isForBuyers() {
        return forBuyers;
    }

    public void setForBuyers(boolean forBuyers) {
        this.forBuyers = forBuyers;
    }

    public Long getTutorId() {
        return tutorId;
    }

    public void setTutorId(Long tutorId) {
        this.tutorId = tutorId;
    }

    public UserBasicInfoDto getTutor() {
        return tutor;
    }

    public void setTutor(UserBasicInfoDto tutor) {
        this.tutor = tutor;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getEnrollmentCount() {
        return enrollmentCount;
    }

    public void setEnrollmentCount(Integer enrollmentCount) {
        this.enrollmentCount = enrollmentCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}