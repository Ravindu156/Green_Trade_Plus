package com.lk.vau.it.project.trade.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // For development, restrict in production
public class UserController {

    @Autowired
    private UserService userService;

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

}