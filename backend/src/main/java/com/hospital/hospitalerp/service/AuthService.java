package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.dto.LoginRequest;
import com.hospital.hospitalerp.dto.LoginResponse;
import com.hospital.hospitalerp.entity.User;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResponse login(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByUsername(request.getUsername());

        // Username not found
        if (optionalUser.isEmpty()) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null,
                    null,
                    false
            );
        }

        User user = optionalUser.get();

        // Check password matching (supports BCrypt and fallback plain text comparison)
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword()) ||
                user.getPassword().equals(request.getPassword());

        if (!passwordMatches) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null,
                    null,
                    false
            );
        }

        Long doctorId = null;
        Long patientId = null;

        // Get linked Doctor ID
        if (user.getDoctor() != null) {
            doctorId = user.getDoctor().getId();
        }

        // Get linked Patient ID
        if (user.getPatient() != null) {
            patientId = user.getPatient().getId();
        }

        // Successful login
        return new LoginResponse(
                true,
                "Login successful",
                user.getUsername(),
                user.getRole(),
                doctorId,
                patientId,
                user.getFirstLoginRequired()
        );
    }

    public com.hospital.hospitalerp.dto.ApiResponse changePassword(com.hospital.hospitalerp.dto.ChangePasswordRequest request) {
        if (request.getUsername() == null || request.getNewPassword() == null) {
            return new com.hospital.hospitalerp.dto.ApiResponse(false, "Username and new password are required");
        }

        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return new com.hospital.hospitalerp.dto.ApiResponse(false, "User not found");
        }

        User user = optionalUser.get();
        boolean passwordMatches = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()) ||
                user.getPassword().equals(request.getCurrentPassword());

        if (!passwordMatches) {
            return new com.hospital.hospitalerp.dto.ApiResponse(false, "Current password does not match");
        }

        String newPwd = request.getNewPassword();
        if (newPwd.length() < 8 ||
                !newPwd.matches(".*[A-Z].*") ||
                !newPwd.matches(".*[a-z].*") ||
                !newPwd.matches(".*[0-9].*") ||
                !newPwd.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
            return new com.hospital.hospitalerp.dto.ApiResponse(false,
                    "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.");
        }

        user.setPassword(passwordEncoder.encode(newPwd));
        user.setFirstLoginRequired(false);
        userRepository.save(user);

        return new com.hospital.hospitalerp.dto.ApiResponse(true, "Password updated successfully! You can now log in.");
    }

    public com.hospital.hospitalerp.dto.ApiResponse forgotPassword(com.hospital.hospitalerp.dto.ForgotPasswordRequest request) {
        if (request.getUsernameOrEmail() == null || request.getUsernameOrEmail().trim().isEmpty()) {
            return new com.hospital.hospitalerp.dto.ApiResponse(false, "Please enter your username or email");
        }

        // Generic response to avoid account enumeration
        return new com.hospital.hospitalerp.dto.ApiResponse(true,
                "If an account matches your details, password reset instructions have been dispatched.");
    }
}