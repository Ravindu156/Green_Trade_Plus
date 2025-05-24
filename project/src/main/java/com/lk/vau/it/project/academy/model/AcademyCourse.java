package com.lk.vau.it.project.academy.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.lk.vau.it.project.trade.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AcademyCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String courseTitle;
    
    @Column(nullable = false, length = 5000)
    private String courseDescription;
    
    @Column(nullable = false)
    private Double courseFees;
    
    @Column(nullable = false)
    private String courseVideo;
    
    @Column(nullable = false)
    private String courseThumbnail;
    
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> suitableFor;
    
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    @JsonBackReference("tutor-course")
    private User tutor;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column
    private Integer enrollmentCount = 0;
    
    @Column
    private Double averageRating = 0.0;

    // Helper method to create suitableFor list based on checkbox values
    public void setSuitableForFromSelections(boolean farmers, boolean sellers, boolean buyers) {
        this.suitableFor.clear();
        if (farmers) this.suitableFor.add("For Farmers");
        if (sellers) this.suitableFor.add("For Sellers");
        if (buyers) this.suitableFor.add("For Buyers");
    }

    // Pre-persist hook to set timestamps
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    // Pre-update hook
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public AcademyCourse() {
    
    }

    public AcademyCourse(Long id, String courseTitle, String courseDescription, Double courseFees, String courseVideo,
            String courseThumbnail, List<String> suitableFor, User tutor, LocalDateTime createdAt,
            LocalDateTime updatedAt, Boolean isActive, Integer enrollmentCount, Double averageRating) {
        this.id = id;
        this.courseTitle = courseTitle;
        this.courseDescription = courseDescription;
        this.courseFees = courseFees;
        this.courseVideo = courseVideo;
        this.courseThumbnail = courseThumbnail;
        this.suitableFor = suitableFor;
        this.tutor = tutor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
        this.enrollmentCount = enrollmentCount;
        this.averageRating = averageRating;
    }

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

    public User getTutor() {
        return tutor;
    }

    public void setTutor(User tutor) {
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
