package com.lk.vau.it.project.academy.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lk.vau.it.project.academy.dto.AcademyCourseDto;
import com.lk.vau.it.project.academy.model.AcademyCourse;
import com.lk.vau.it.project.academy.repository.AcademyCourseRepository;
import com.lk.vau.it.project.service.CloudinaryService;
import com.lk.vau.it.project.trade.model.User;
import com.lk.vau.it.project.trade.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AcademyCourseService {

    @Autowired
    private UserRepository userRepository;

    private final AcademyCourseRepository courseRepository;
    private final CloudinaryService cloudinaryService;

    public AcademyCourseService(AcademyCourseRepository courseRepository, CloudinaryService cloudinaryService) {
        this.courseRepository = courseRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public List<AcademyCourse> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<AcademyCourse> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional
    public AcademyCourse createCourse(AcademyCourseDto dto) {
        AcademyCourse course = dto.toEntity();

        // Find tutor by tutorId
        User tutor = userRepository.findById(dto.getTutorId())
            .orElseThrow(() -> new RuntimeException("Tutor not found"));

        course.setTutor(tutor);
        
        course.prePersist();
        return courseRepository.save(course);
    }

    @Transactional
    public AcademyCourse updateCourse(Long id, AcademyCourseDto dto, MultipartFile thumbnail) throws IOException {
        AcademyCourse course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + id));

        dto.updateEntity(course);

        // Upload new thumbnail if provided
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(thumbnail,"image");
            course.setCourseThumbnail(imageUrl);
        }

        course.preUpdate();
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
