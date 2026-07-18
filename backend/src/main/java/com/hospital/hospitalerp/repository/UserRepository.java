package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find login account by username
    Optional<User> findByUsername(String username);

    // Find the login account linked to a specific doctor
    Optional<User> findByDoctorId(Long doctorId);

    // Find the login account linked to a specific patient
    Optional<User> findByPatientId(Long patientId);
}