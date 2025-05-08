package com.lk.vau.it.project.trade.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lk.vau.it.project.trade.dto.AuthResponseDto;
import com.lk.vau.it.project.trade.dto.LoginRequestDto;
import com.lk.vau.it.project.trade.dto.UserBasicInfoDto;
import com.lk.vau.it.project.trade.dto.UserRegistrationDto;
import com.lk.vau.it.project.trade.exception.ResourceAlreadyExistsException;
import com.lk.vau.it.project.trade.service.UserService;

import javax.validation.Valid;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // For development, restrict in production
public class UserController {

    @Autowired
    private UserService userService;

    private static final String IMAGE_DIRECTORY = "C:/Users/ADMIN/Desktop/Green_Trade_Plus/profile-photos/";

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(@ModelAttribute @Valid UserRegistrationDto registrationDto) {
        try {
            AuthResponseDto response = userService.registerUser(registrationDto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ResourceAlreadyExistsException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid LoginRequestDto loginRequest) {
        try {
            AuthResponseDto response = userService.loginUser(loginRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Login failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{userId}/basic-info")
    public ResponseEntity<UserBasicInfoDto> getUserBasicInfo(@PathVariable Long userId) {
        UserBasicInfoDto info = userService.getUserBasicInfo(userId);
        return ResponseEntity.ok(info);
    }

    @GetMapping("/profile-photos/{imageName}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String imageName) {
        try {
            File file = new File(IMAGE_DIRECTORY + imageName);
            if (file.exists()) {
                Resource resource = new FileSystemResource(file);
                String fileExtension = getFileExtension(imageName);
                MediaType mediaType = MediaType.IMAGE_PNG;  // Default fallback

                if ("jpg".equalsIgnoreCase(fileExtension) || "jpeg".equalsIgnoreCase(fileExtension)) {
                    mediaType = MediaType.IMAGE_JPEG;
                } else if ("gif".equalsIgnoreCase(fileExtension)) {
                    mediaType = MediaType.IMAGE_GIF;
                }

                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to get the file extension
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }
}
