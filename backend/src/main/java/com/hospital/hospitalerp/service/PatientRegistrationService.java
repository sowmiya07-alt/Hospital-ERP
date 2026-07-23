package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.dto.PatientRegisterRequest;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.User;
import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientRegistrationService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User registerPatient(
            PatientRegisterRequest request) {

        // =========================
        // VALIDATE REQUIRED FIELDS
        // =========================

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Patient name is required"
            );
        }

        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            throw new RuntimeException(
                    "Username is required"
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }

        // =========================
        // CHECK DUPLICATE USERNAME
        // =========================

        String username =
                request.getUsername().trim();

        if (userRepository
                .findByUsername(username)
                .isPresent()) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // =========================
        // CREATE PATIENT
        // =========================

        Patient patient = new Patient();

        patient.setName(
                request.getName().trim()
        );

        patient.setAge(
                request.getAge()
        );

        patient.setGender(
                request.getGender()
        );

        patient.setPhone(
                request.getPhone()
        );

        patient.setAddress(
                request.getAddress()
        );

        Patient savedPatient =
                patientRepository.save(patient);

        // =========================
        // CREATE LOGIN ACCOUNT
        // =========================

        User user = new User();

        user.setUsername(username);

        user.setPassword(
                request.getPassword()
        );

        // User cannot choose ADMIN
        // or DOCTOR during registration.
        user.setRole("PATIENT");

        user.setPatient(savedPatient);

        user.setDoctor(null);

        // =========================
        // SAVE USER
        // =========================

        return userRepository.save(user);
    }
}
