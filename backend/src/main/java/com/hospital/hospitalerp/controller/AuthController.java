package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.dto.LoginRequest;
import com.hospital.hospitalerp.dto.LoginResponse;
import com.hospital.hospitalerp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}