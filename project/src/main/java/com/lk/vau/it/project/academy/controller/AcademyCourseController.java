package com.lk.vau.it.project.academy.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.lk.vau.it.project.academy.dto.AcademyCourseDto;
import com.lk.vau.it.project.academy.model.AcademyCourse;
import com.lk.vau.it.project.academy.service.AcademyCourseService;
import com.lk.vau.it.project.service.CloudinaryService;

@RestController
@RequestMapping("/api/academy/courses")
@CrossOrigin
public class AcademyCourseController {

    private final AcademyCourseService courseService;
    private final CloudinaryService cloudinaryService;

    public AcademyCourseController(AcademyCourseService courseService, CloudinaryService cloudinaryService) {
        this.courseService = courseService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public List<AcademyCourse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademyCourse> getCourse(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> createCourse(
            @ModelAttribute AcademyCourseDto courseDto,
            @RequestParam("thumbnailFile") MultipartFile thumbnail,
            @RequestParam("videoFile") MultipartFile video) throws IOException {

        // Upload to Cloudinary
        String courseThumbnailUrl = cloudinaryService.uploadFile(thumbnail,"image");
        String courseVideoUrl = cloudinaryService.uploadFile(video,"video");

        // Set URLs to DTO
        courseDto.setCourseThumbnail(courseThumbnailUrl);
        courseDto.setCourseVideo(courseVideoUrl);

        // Save to database
        AcademyCourse savedCourse = courseService.createCourse(courseDto);
        return ResponseEntity.ok(savedCourse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademyCourse> updateCourse(
            @PathVariable Long id,
            @ModelAttribute AcademyCourseDto dto,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) throws IOException {
        return ResponseEntity.ok(courseService.updateCourse(id, dto, thumbnail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
