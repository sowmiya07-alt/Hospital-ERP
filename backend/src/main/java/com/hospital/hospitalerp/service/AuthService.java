package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.dto.LoginRequest;
import com.hospital.hospitalerp.dto.LoginResponse;
import com.hospital.hospitalerp.entity.User;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

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
                    null
            );
        }

        User user = optionalUser.get();

        // Wrong password
        if (!user.getPassword().equals(request.getPassword())) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null,
                    null
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
                patientId
        );
    }
}