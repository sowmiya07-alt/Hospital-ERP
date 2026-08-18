package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    List<Admission> findByPatientId(Long patientId);
    List<Admission> findByStatus(String status);
}
