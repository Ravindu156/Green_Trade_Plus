package com.lk.vau.it.project.academy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lk.vau.it.project.academy.model.AcademyCourse;

@Repository
public interface AcademyCourseRepository extends JpaRepository<AcademyCourse, Long> {
    
    // Find all active courses
    List<AcademyCourse> findByIsActiveTrue();
    
    // Find courses by tutor ID
    List<AcademyCourse> findByTutorIdAndIsActiveTrue(Long tutorId);
    
    // Find courses by title containing keyword (case insensitive)
    @Query("SELECT c FROM AcademyCourse c WHERE LOWER(c.courseTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) AND c.isActive = true")
    List<AcademyCourse> findByCourseTitleContainingIgnoreCaseAndIsActiveTrue(@Param("keyword") String keyword);
    
    // Find courses by suitable for category
    @Query("SELECT c FROM AcademyCourse c WHERE :category MEMBER OF c.suitableFor AND c.isActive = true")
    List<AcademyCourse> findBySuitableForContainingAndIsActiveTrue(@Param("category") String category);
    
    // Find courses with fees less than or equal to specified amount
    List<AcademyCourse> findByCourseFeesLessThanEqualAndIsActiveTrue(Double maxFee);
    
    // Find courses with fees between min and max
    List<AcademyCourse> findByCourseFeesBetweenAndIsActiveTrue(Double minFee, Double maxFee);
    
    // Find top courses by average rating
    @Query("SELECT c FROM AcademyCourse c WHERE c.isActive = true ORDER BY c.averageRating DESC")
    List<AcademyCourse> findTopRatedCourses();
    
    // Find popular courses by enrollment count
    @Query("SELECT c FROM AcademyCourse c WHERE c.isActive = true ORDER BY c.enrollmentCount DESC")
    List<AcademyCourse> findPopularCourses();
    
    // Count active courses by tutor
    Long countByTutorIdAndIsActiveTrue(Long tutorId);
    
    // Check if course exists and is active
    boolean existsByIdAndIsActiveTrue(Long id);
}