package com.lk.vau.it.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lk.vau.it.project.dto.AuthResponseDto;
import com.lk.vau.it.project.dto.LoginRequestDto;
import com.lk.vau.it.project.dto.UserRegistrationDto;
import com.lk.vau.it.project.exception.ResourceAlreadyExistsException;
import com.lk.vau.it.project.model.User;
import com.lk.vau.it.project.repository.UserRepository;
import com.lk.vau.it.project.util.JwtUtil;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDto registerUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByPhoneNumber(registrationDto.getPhoneNumber())) {
            throw new ResourceAlreadyExistsException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.setRole(registrationDto.getRole());
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setUserName(registrationDto.getUserName());
        user.setEmail(registrationDto.getEmail());
        user.setGender(registrationDto.getGender());
        user.setPassword(registrationDto.getPassword());
        user.setAddressLineOne(registrationDto.getAddressLineOne());
        user.setAddressLineTwo(registrationDto.getAddressLineTwo());
        user.setProvince(registrationDto.getProvince());
        user.setDistrict(registrationDto.getDistrict());
        user.setCity(registrationDto.getCity());
        user.setPhoneNumber(registrationDto.getPhoneNumber());

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUserName());

        // Return response
        return new AuthResponseDto(
                savedUser.getId(),
                token,
                savedUser.getUserName(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                savedUser.getRole()
        );
    }

    public AuthResponseDto loginUser(LoginRequestDto loginRequest) {
        // Find user by username or phone number
        User user = userRepository.findByUserName(loginRequest.getUsernameOrPhone())
                .orElseGet(() -> userRepository.findByPhoneNumber(loginRequest.getUsernameOrPhone())
                        .orElseThrow(() -> new RuntimeException("Invalid username or phone number")));

        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUserName());

        // Return response
        return new AuthResponseDto(
                user.getId(),
                token,
                user.getUserName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}
