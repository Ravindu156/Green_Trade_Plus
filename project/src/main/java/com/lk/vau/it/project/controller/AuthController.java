package com.lk.vau.it.project.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lk.vau.it.project.dto.AuthResponseDto;
import com.lk.vau.it.project.dto.LoginRequestDto;
import com.lk.vau.it.project.dto.UserRegistrationDto;
import com.lk.vau.it.project.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        AuthResponseDto response = userService.registerUser(registrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> loginUser(@RequestBody LoginRequestDto loginRequest) {
        AuthResponseDto response = userService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}
