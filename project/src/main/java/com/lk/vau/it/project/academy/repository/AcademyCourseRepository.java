package com.lk.vau.it.project.academy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lk.vau.it.project.academy.model.AcademyCourse;

@Repository
public interface AcademyCourseRepository extends JpaRepository<AcademyCourse, Long> {
}
