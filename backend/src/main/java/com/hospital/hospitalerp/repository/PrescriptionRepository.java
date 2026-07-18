package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    // Get prescriptions belonging to one patient
    List<Prescription> findByPatientId(Long patientId);
}