package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.User;

import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;


    // ==========================================
    // CREATE PATIENT + CREATE LOGIN ACCOUNT
    // ==========================================

    public Patient savePatient(Patient patient) {

        // First save patient
        Patient savedPatient =
                patientRepository.save(patient);

        // Generate unique username
        String username =
                generateUsername(
                        savedPatient.getName(),
                        savedPatient.getId()
                );

        // Generate default password
        String password =
                username + "123";

        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

        // Create patient login account
        User patientUser = new User();

        patientUser.setUsername(username);
        patientUser.setPassword(encoder.encode(password));
        patientUser.setRole("PATIENT");

        // Link login ONLY to this patient
        patientUser.setPatient(savedPatient);

        // Patient must not be linked to doctor
        patientUser.setDoctor(null);

        // Save login
        userRepository.save(patientUser);

        return savedPatient;
    }


    // ==========================================
    // GENERATE UNIQUE USERNAME
    // ==========================================

    private String generateUsername(
            String patientName,
            Long patientId) {

        String baseUsername;

        if (
                patientName == null ||
                patientName.trim().isEmpty()
        ) {

            baseUsername = "patient";

        } else {

            baseUsername =
                    patientName
                            .toLowerCase()
                            .replaceAll(
                                    "[^a-z0-9]",
                                    ""
                            );
        }

        if (baseUsername.isEmpty()) {

            baseUsername = "patient";
        }

        String username =
                baseUsername;

        if (
                userRepository
                        .findByUsername(username)
                        .isPresent()
        ) {

            username =
                    baseUsername
                            + patientId;
        }

        return username;
    }


    // ==========================================
    // GET ALL PATIENTS
    // ==========================================

    public List<Patient> getAllPatients() {

        return patientRepository.findAll();
    }


    // ==========================================
    // GET PATIENT BY ID
    // ==========================================

    public Patient getPatientById(Long id) {

        return patientRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // UPDATE PATIENT
    // ==========================================

    public Patient updatePatient(
            Long id,
            Patient patient) {

        Patient existing =
                patientRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {

            return null;
        }

        existing.setName(patient.getName());
        existing.setAge(patient.getAge());
        existing.setGender(patient.getGender());
        existing.setPhone(patient.getPhone());
        existing.setEmail(patient.getEmail());
        existing.setAddress(patient.getAddress());
        existing.setBloodGroup(patient.getBloodGroup());
        existing.setEmergencyContact(patient.getEmergencyContact());
        existing.setEmergencyPhone(patient.getEmergencyPhone());
        existing.setAllergies(patient.getAllergies());
        existing.setMedicalHistory(patient.getMedicalHistory());
        if (patient.getStatus() != null) {
            existing.setStatus(patient.getStatus());
        }

        return patientRepository.save(existing);
    }


    // ==========================================
    // DELETE PATIENT
    // ==========================================

    public String deletePatient(Long id) {

        if (
                !patientRepository.existsById(id)
        ) {

            return "Patient Not Found";
        }

        patientRepository.deleteById(id);

        return "Patient Deleted Successfully";
    }
}