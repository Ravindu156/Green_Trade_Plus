package com.lk.vau.it.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lk.vau.it.project.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<User> findByUsername(String user_name);
    boolean existsByUsername(String user_name);

    Optional<User> findByPhoneNumber(String phone_number);
    boolean existsByPhoneNumber(String phone_number);
}