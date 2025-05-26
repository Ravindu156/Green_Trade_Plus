package com.lk.vau.it.project.academy.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.lk.vau.it.project.academy.dto.AcademyCourseDto;
import com.lk.vau.it.project.academy.model.AcademyCourse;
import com.lk.vau.it.project.academy.repository.AcademyCourseRepository;

@Service
@Transactional
public class AcademyCourseService {
    
    @Autowired
    private AcademyCourseRepository courseRepository;
    
    @Value("${app.course.thumbnail.upload.dir:course-thumbnails}")
    private String uploadDir;
    
    // Create a new course
    public AcademyCourseDto createCourse(AcademyCourseDto courseDto, MultipartFile thumbnailFile) {
        AcademyCourse course = courseDto.toEntity();
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        course.setIsActive(true);
        course.setEnrollmentCount(0);
        course.setAverageRating(0.0);
        
        // Handle thumbnail upload if provided
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String thumbnailPath = saveCourseThumbnail(thumbnailFile, course.getCourseTitle());
            course.setCourseThumbnail(thumbnailPath);
        }
        
        AcademyCourse savedCourse = courseRepository.save(course);
        return new AcademyCourseDto(savedCourse);
    }
    
    // Create course without file upload (for backward compatibility)
    public AcademyCourseDto createCourse(AcademyCourseDto courseDto) {
        return createCourse(courseDto, null);
    }
    
    // Get all active courses
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getAllActiveCourses() {
        List<AcademyCourse> courses = courseRepository.findByIsActiveTrue();
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get all courses (including inactive)
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getAllCourses() {
        List<AcademyCourse> courses = courseRepository.findAll();
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get course by ID
    @Transactional(readOnly = true)
    public Optional<AcademyCourseDto> getCourseById(Long id) {
        Optional<AcademyCourse> course = courseRepository.findById(id);
        return course.map(AcademyCourseDto::new);
    }
    
    // Get active course by ID
    @Transactional(readOnly = true)
    public Optional<AcademyCourseDto> getActiveCourseById(Long id) {
        Optional<AcademyCourse> course = courseRepository.findById(id);
        if (course.isPresent() && course.get().getIsActive()) {
            return Optional.of(new AcademyCourseDto(course.get()));
        }
        return Optional.empty();
    }
    
    // Update course
    public Optional<AcademyCourseDto> updateCourse(Long id, AcademyCourseDto courseDto, MultipartFile thumbnailFile) {
        Optional<AcademyCourse> existingCourse = courseRepository.findById(id);
        
        if (existingCourse.isPresent()) {
            AcademyCourse course = existingCourse.get();
            courseDto.updateEntity(course);
            course.setUpdatedAt(LocalDateTime.now());
            
            // Handle thumbnail upload if provided
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String thumbnailPath = saveCourseThumbnail(thumbnailFile, course.getCourseTitle());
                course.setCourseThumbnail(thumbnailPath);
            }
            
            AcademyCourse updatedCourse = courseRepository.save(course);
            return Optional.of(new AcademyCourseDto(updatedCourse));
        }
        
        return Optional.empty();
    }
    
    // Update course without file upload (for backward compatibility)
    public Optional<AcademyCourseDto> updateCourse(Long id, AcademyCourseDto courseDto) {
        return updateCourse(id, courseDto, null);
    }
    
    // Soft delete course (set isActive to false)
    public boolean deleteCourse(Long id) {
        Optional<AcademyCourse> course = courseRepository.findById(id);
        
        if (course.isPresent()) {
            AcademyCourse existingCourse = course.get();
            existingCourse.setIsActive(false);
            existingCourse.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(existingCourse);
            return true;
        }
        
        return false;
    }
    
    // Hard delete course
    public boolean hardDeleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Restore deleted course
    public boolean restoreCourse(Long id) {
        Optional<AcademyCourse> course = courseRepository.findById(id);
        
        if (course.isPresent()) {
            AcademyCourse existingCourse = course.get();
            existingCourse.setIsActive(true);
            existingCourse.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(existingCourse);
            return true;
        }
        
        return false;
    }
    
    // Get courses by tutor ID
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getCoursesByTutorId(Long tutorId) {
        List<AcademyCourse> courses = courseRepository.findByTutorIdAndIsActiveTrue(tutorId);
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Search courses by title
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> searchCoursesByTitle(String keyword) {
        List<AcademyCourse> courses = courseRepository.findByCourseTitleContainingIgnoreCaseAndIsActiveTrue(keyword);
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get courses by category
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getCoursesByCategory(String category) {
        List<AcademyCourse> courses = courseRepository.findBySuitableForContainingAndIsActiveTrue(category);
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get courses by price range
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getCoursesByPriceRange(Double minPrice, Double maxPrice) {
        List<AcademyCourse> courses = courseRepository.findByCourseFeesBetweenAndIsActiveTrue(minPrice, maxPrice);
        return courses.stream()
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get top rated courses
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getTopRatedCourses(int limit) {
        List<AcademyCourse> courses = courseRepository.findTopRatedCourses();
        return courses.stream()
                     .limit(limit)
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Get popular courses
    @Transactional(readOnly = true)
    public List<AcademyCourseDto> getPopularCourses(int limit) {
        List<AcademyCourse> courses = courseRepository.findPopularCourses();
        return courses.stream()
                     .limit(limit)
                     .map(AcademyCourseDto::new)
                     .collect(Collectors.toList());
    }
    
    // Update enrollment count
    public void updateEnrollmentCount(Long courseId) {
        Optional<AcademyCourse> course = courseRepository.findById(courseId);
        
        if (course.isPresent()) {
            AcademyCourse existingCourse = course.get();
            existingCourse.setEnrollmentCount(existingCourse.getEnrollmentCount() + 1);
            existingCourse.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(existingCourse);
        }
    }
    
    // Update average rating
    public void updateAverageRating(Long courseId, Double newRating) {
        Optional<AcademyCourse> course = courseRepository.findById(courseId);
        
        if (course.isPresent()) {
            AcademyCourse existingCourse = course.get();
            existingCourse.setAverageRating(newRating);
            existingCourse.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(existingCourse);
        }
    }
    
    // Get course count by tutor
    @Transactional(readOnly = true)
    public Long getCourseCountByTutor(Long tutorId) {
        return courseRepository.countByTutorIdAndIsActiveTrue(tutorId);
    }
    
    // Check if course exists and is active
    @Transactional(readOnly = true)
    public boolean courseExistsAndActive(Long id) {
        return courseRepository.existsByIdAndIsActiveTrue(id);
    }
    
    /**
     * Saves the course thumbnail to the file system and returns the file path
     * 
     * @param file        The thumbnail file
     * @param courseTitle The course title to use as part of the file name
     * @return The relative path to the saved file
     */
    private String saveCourseThumbnail(MultipartFile file, String courseTitle) {
        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique file name to prevent duplicates
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String sanitizedTitle = sanitizeFileName(courseTitle);
            String fileName = sanitizedTitle + "-" + UUID.randomUUID().toString() + fileExtension;

            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store course thumbnail", e);
        }
    }

    /**
     * Extracts the file extension from the original file name
     * 
     * @param fileName The original file name
     * @return The file extension with dot (e.g., ".jpg")
     */
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return ".jpg"; // Default extension
        }
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0) {
            return ".jpg"; // Default extension
        }
        return fileName.substring(dotIndex);
    }

    /**
     * Sanitizes the course title to be used as part of a file name
     * 
     * @param courseTitle The course title
     * @return A sanitized version safe for file names
     */
    private String sanitizeFileName(String courseTitle) {
        if (courseTitle == null) {
            return "course";
        }
        // Replace spaces and special characters with hyphens, limit length
        return courseTitle.replaceAll("[^a-zA-Z0-9]", "-")
                         .replaceAll("-+", "-")
                         .toLowerCase()
                         .substring(0, Math.min(courseTitle.length(), 50));
    }
}