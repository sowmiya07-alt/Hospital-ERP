package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    // Find a doctor using email
    Optional<Doctor> findByEmail(String email);

}