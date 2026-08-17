package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.dto.PatientRegisterRequest;
import com.hospital.hospitalerp.entity.User;
import com.hospital.hospitalerp.service.PatientRegistrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class PatientRegistrationController {

    @Autowired
    private PatientRegistrationService patientRegistrationService;

    // ============================
    // PATIENT REGISTRATION
    // ============================

    @PostMapping("/register/patient")
    public ResponseEntity<Map<String, Object>> registerPatient(
            @RequestBody PatientRegisterRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {

            User user =
                    patientRegistrationService
                            .registerPatient(request);

            response.put("success", true);

            response.put(
                    "message",
                    "Patient account created successfully"
            );

            response.put(
                    "username",
                    user.getUsername()
            );

            response.put(
                    "role",
                    user.getRole()
            );

            if (user.getPatient() != null) {

                response.put(
                        "patientId",
                        user.getPatient().getId()
                );
            }

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            response.put("success", false);

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}
