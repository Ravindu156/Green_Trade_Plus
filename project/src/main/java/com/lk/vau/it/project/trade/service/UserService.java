package com.lk.vau.it.project.trade.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lk.vau.it.project.trade.dto.AuthResponseDto;
import com.lk.vau.it.project.trade.dto.LoginRequestDto;
import com.lk.vau.it.project.trade.dto.UserRegistrationDto;
import com.lk.vau.it.project.trade.exception.ResourceAlreadyExistsException;
import com.lk.vau.it.project.trade.model.User;
import com.lk.vau.it.project.trade.repository.UserRepository;
import com.lk.vau.it.project.trade.util.JwtUtil;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${app.profile.photo.upload.dir:profile-photos}")
    private String uploadDir;

    public AuthResponseDto registerUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByPhoneNumber(registrationDto.getPhoneNumber())) {
            throw new ResourceAlreadyExistsException("Phone Number is already in use");
        }

        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email is already in use");
        }
        
        if (userRepository.existsByUserName(registrationDto.getUserName())) {
            throw new ResourceAlreadyExistsException("Username is already in use");
        }

        // Create new user
        User user = new User();
        user.setRole(registrationDto.getRole());
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setUserName(registrationDto.getUserName());
        user.setEmail(registrationDto.getEmail());
        user.setGender(registrationDto.getGender());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setAddressLineOne(registrationDto.getAddressLineOne());
        user.setAddressLineTwo(registrationDto.getAddressLineTwo());
        user.setProvince(registrationDto.getProvince());
        user.setDistrict(registrationDto.getDistrict());
        user.setCity(registrationDto.getCity());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        
        // Handle profile photo upload if provided
        if (registrationDto.getProfilePhoto() != null && !registrationDto.getProfilePhoto().isEmpty()) {
            String photoPath = saveProfilePhoto(registrationDto.getProfilePhoto(), registrationDto.getUserName());
            user.setProfilePhotoPath(photoPath);
        }

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

        // Update last login time
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

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
    
    /**
     * Saves the profile photo to the file system and returns the file path
     * 
     * @param file The profile photo file
     * @param username The username to use as part of the file name
     * @return The relative path to the saved file
     */
    private String saveProfilePhoto(MultipartFile file, String username) {
        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique file name to prevent duplicates
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String fileName = username + "-" + UUID.randomUUID().toString() + fileExtension;
            
            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store profile photo", e);
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
}