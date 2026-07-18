package com.hospital.hospitalerp;

import com.hospital.hospitalerp.entity.Doctor;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.User;

import com.hospital.hospitalerp.repository.DoctorRepository;
import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class HospitalErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                HospitalErpApplication.class,
                args
        );
    }

    @Bean
    CommandLineRunner createAndLinkUsers(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {

        return args -> {

            // ==========================
            // CREATE ADMIN ACCOUNT
            // ==========================

            if (userRepository
                    .findByUsername("admin")
                    .isEmpty()) {

                User admin = new User(
                        null,
                        "admin",
                        "admin123",
                        "ADMIN"
                );

                userRepository.save(admin);
            }


            // ==========================
            // CREATE / GET DOCTOR USER
            // ==========================

            User doctorUser =
                    userRepository
                            .findByUsername("doctor")
                            .orElseGet(() -> {

                                User newDoctorUser =
                                        new User(
                                                null,
                                                "doctor",
                                                "doctor123",
                                                "DOCTOR"
                                        );

                                return userRepository
                                        .save(newDoctorUser);
                            });


            // ==========================
            // CREATE / GET PATIENT USER
            // ==========================

            User patientUser =
                    userRepository
                            .findByUsername("patient")
                            .orElseGet(() -> {

                                User newPatientUser =
                                        new User(
                                                null,
                                                "patient",
                                                "patient123",
                                                "PATIENT"
                                        );

                                return userRepository
                                        .save(newPatientUser);
                            });


            // ==========================
            // LINK DOCTOR LOGIN
            // ==========================

            List<Doctor> doctors =
                    doctorRepository.findAll();

            if (!doctors.isEmpty()) {

                Doctor doctor = doctors.get(0);

                doctorUser.setDoctor(doctor);
                doctorUser.setPatient(null);

                userRepository.save(doctorUser);

                System.out.println(
                        "Doctor login linked to Doctor ID: "
                                + doctor.getId()
                );

            } else {

                System.out.println(
                        "No Doctor record found. " +
                        "Add a doctor from Admin portal."
                );
            }


            // ==========================
            // LINK PATIENT LOGIN
            // ==========================

            List<Patient> patients =
                    patientRepository.findAll();

            if (!patients.isEmpty()) {

                Patient patient = patients.get(0);

                patientUser.setPatient(patient);
                patientUser.setDoctor(null);

                userRepository.save(patientUser);

                System.out.println(
                        "Patient login linked to Patient ID: "
                                + patient.getId()
                );

            } else {

                System.out.println(
                        "No Patient record found. " +
                        "Add a patient from Admin portal."
                );
            }


            System.out.println(
                    "ADMIN, DOCTOR and PATIENT users are ready."
            );
        };
    }
}