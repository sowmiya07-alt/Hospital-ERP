package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.dto.LoginRequest;
import com.hospital.hospitalerp.dto.LoginResponse;
import com.hospital.hospitalerp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/change-password")
    public com.hospital.hospitalerp.dto.ApiResponse changePassword(
            @RequestBody com.hospital.hospitalerp.dto.ChangePasswordRequest request) {

        return authService.changePassword(request);
    }

    @PostMapping("/forgot-password")
    public com.hospital.hospitalerp.dto.ApiResponse forgotPassword(
            @RequestBody com.hospital.hospitalerp.dto.ForgotPasswordRequest request) {

        return authService.forgotPassword(request);
    }
}