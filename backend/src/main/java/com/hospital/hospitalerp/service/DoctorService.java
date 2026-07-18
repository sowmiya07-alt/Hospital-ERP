package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Doctor;
import com.hospital.hospitalerp.entity.User;

import com.hospital.hospitalerp.repository.DoctorRepository;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;


    // ==========================================
    // CREATE DOCTOR + LOGIN ACCOUNT
    // ==========================================

    @Transactional
    public Doctor saveDoctor(Doctor doctor) {

        Doctor savedDoctor =
                doctorRepository.save(doctor);

        String username =
                generateUsername(
                        savedDoctor.getName(),
                        savedDoctor.getId()
                );

        String password =
                username + "123";

        User doctorUser = new User();

        doctorUser.setUsername(username);
        doctorUser.setPassword(password);
        doctorUser.setRole("DOCTOR");

        doctorUser.setDoctor(savedDoctor);
        doctorUser.setPatient(null);

        userRepository.save(doctorUser);

        System.out.println(
                "================================="
        );

        System.out.println(
                "Doctor Created Successfully"
        );

        System.out.println(
                "Doctor ID: " +
                        savedDoctor.getId()
        );

        System.out.println(
                "Doctor Name: " +
                        savedDoctor.getName()
        );

        System.out.println(
                "Username: " + username
        );

        System.out.println(
                "Password: " + password
        );

        System.out.println(
                "================================="
        );

        return savedDoctor;
    }


    // ==========================================
    // GENERATE UNIQUE USERNAME
    // ==========================================

    private String generateUsername(
            String doctorName,
            Long doctorId) {

        String baseUsername;

        if (
                doctorName == null ||
                doctorName.trim().isEmpty()
        ) {

            baseUsername = "doctor";

        } else {

            baseUsername =
                    doctorName
                            .toLowerCase()
                            .replaceAll(
                                    "[^a-z0-9]",
                                    ""
                            );
        }

        if (baseUsername.isEmpty()) {

            baseUsername = "doctor";
        }

        String username = baseUsername;

        if (
                userRepository
                        .findByUsername(username)
                        .isPresent()
        ) {

            username =
                    baseUsername + doctorId;
        }

        return username;
    }


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }


    // ==========================================
    // GET DOCTOR BY ID
    // ==========================================

    public Doctor getDoctorById(Long id) {

        return doctorRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // UPDATE DOCTOR
    // ==========================================

    public Doctor updateDoctor(
            Long id,
            Doctor doctor) {

        Doctor existing =
                doctorRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {

            return null;
        }

        existing.setName(
                doctor.getName()
        );

        existing.setSpecialization(
                doctor.getSpecialization()
        );

        existing.setPhone(
                doctor.getPhone()
        );

        existing.setEmail(
                doctor.getEmail()
        );

        existing.setExperience(
                doctor.getExperience()
        );

        return doctorRepository.save(existing);
    }


    // ==========================================
    // DELETE DOCTOR
    // ==========================================

    @Transactional
    public String deleteDoctor(Long id) {

        Doctor doctor =
                doctorRepository
                        .findById(id)
                        .orElse(null);

        if (doctor == null) {

            return "Doctor Not Found";
        }

        // Find login linked to this doctor
        Optional<User> linkedUser =
                userRepository.findByDoctorId(id);

        // Delete doctor's login first
        if (linkedUser.isPresent()) {

            userRepository.delete(
                    linkedUser.get()
            );

            userRepository.flush();
        }

        // Then delete doctor
        doctorRepository.delete(doctor);

        doctorRepository.flush();

        return "Doctor Deleted Successfully";
    }
}