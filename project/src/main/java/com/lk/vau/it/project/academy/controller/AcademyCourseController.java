package com.lk.vau.it.project.academy.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lk.vau.it.project.academy.dto.AcademyCourseDto;
import com.lk.vau.it.project.academy.service.AcademyCourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/academy/courses")
@CrossOrigin(origins = "*")
@Validated
public class AcademyCourseController {

    @Autowired
    private AcademyCourseService courseService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AcademyCourseDto> createCourse(
            @ModelAttribute @Valid AcademyCourseDto courseDto,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnailFile) {
        try {
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String filename = saveThumbnailFile(thumbnailFile); // Your method to save file & return filename
                courseDto.setCourseThumbnail(filename);
            }
            AcademyCourseDto createdCourse = courseService.createCourse(courseDto, thumbnailFile);
            return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Value("${app.course.thumbnail.upload.dir:course-thumbnails}")
    private String uploadDir;

    private String saveThumbnailFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = UUID.randomUUID().toString() + extension;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return newFilename;
    }

    // Get all active courses
    @GetMapping
    public ResponseEntity<List<AcademyCourseDto>> getAllActiveCourses() {
        try {
            List<AcademyCourseDto> courses = courseService.getAllActiveCourses();
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all courses (including inactive) - Admin only
    @GetMapping("/all")
    public ResponseEntity<List<AcademyCourseDto>> getAllCourses() {
        try {
            List<AcademyCourseDto> courses = courseService.getAllCourses();
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<AcademyCourseDto> getCourseById(@PathVariable Long id) {
        try {
            Optional<AcademyCourseDto> course = courseService.getActiveCourseById(id);
            if (course.isPresent()) {
                return new ResponseEntity<>(course.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update course with file upload
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AcademyCourseDto> updateCourse(
            @PathVariable Long id,
            @RequestPart("course") @Valid AcademyCourseDto courseDto,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnailFile) {
        try {
            Optional<AcademyCourseDto> updatedCourse = courseService.updateCourse(id, courseDto, thumbnailFile);
            if (updatedCourse.isPresent()) {
                return new ResponseEntity<>(updatedCourse.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update course without file upload (for JSON requests)
    @PutMapping(value = "/{id}/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AcademyCourseDto> updateCourseJson(@PathVariable Long id,
            @Valid @RequestBody AcademyCourseDto courseDto) {
        try {
            Optional<AcademyCourseDto> updatedCourse = courseService.updateCourse(id, courseDto);
            if (updatedCourse.isPresent()) {
                return new ResponseEntity<>(updatedCourse.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Soft delete course
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCourse(@PathVariable Long id) {
        try {
            boolean deleted = courseService.deleteCourse(id);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hard delete course - Admin only
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<HttpStatus> hardDeleteCourse(@PathVariable Long id) {
        try {
            boolean deleted = courseService.hardDeleteCourse(id);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Restore deleted course - Admin only
    @PutMapping("/{id}/restore")
    public ResponseEntity<HttpStatus> restoreCourse(@PathVariable Long id) {
        try {
            boolean restored = courseService.restoreCourse(id);
            if (restored) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by tutor ID
    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<AcademyCourseDto>> getCoursesByTutorId(@PathVariable Long tutorId) {
        try {
            List<AcademyCourseDto> courses = courseService.getCoursesByTutorId(tutorId);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search courses by title
    @GetMapping("/search")
    public ResponseEntity<List<AcademyCourseDto>> searchCourses(@RequestParam String keyword) {
        try {
            List<AcademyCourseDto> courses = courseService.searchCoursesByTitle(keyword);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AcademyCourseDto>> getCoursesByCategory(@PathVariable String category) {
        try {
            List<AcademyCourseDto> courses = courseService.getCoursesByCategory(category);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<AcademyCourseDto>> getCoursesByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        try {
            List<AcademyCourseDto> courses = courseService.getCoursesByPriceRange(minPrice, maxPrice);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get top rated courses
    @GetMapping("/top-rated")
    public ResponseEntity<List<AcademyCourseDto>> getTopRatedCourses(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<AcademyCourseDto> courses = courseService.getTopRatedCourses(limit);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get popular courses
    @GetMapping("/popular")
    public ResponseEntity<List<AcademyCourseDto>> getPopularCourses(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<AcademyCourseDto> courses = courseService.getPopularCourses(limit);
            if (courses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update enrollment count
    @PutMapping("/{id}/enroll")
    public ResponseEntity<HttpStatus> updateEnrollmentCount(@PathVariable Long id) {
        try {
            if (courseService.courseExistsAndActive(id)) {
                courseService.updateEnrollmentCount(id);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update average rating
    @PutMapping("/{id}/rating")
    public ResponseEntity<HttpStatus> updateAverageRating(@PathVariable Long id,
            @RequestParam Double rating) {
        try {
            if (rating < 0.0 || rating > 5.0) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (courseService.courseExistsAndActive(id)) {
                courseService.updateAverageRating(id, rating);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get course count by tutor
    @GetMapping("/tutor/{tutorId}/count")
    public ResponseEntity<Long> getCourseCountByTutor(@PathVariable Long tutorId) {
        try {
            Long count = courseService.getCourseCountByTutor(tutorId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}