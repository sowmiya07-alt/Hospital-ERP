package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatientId(Long patientId);
    List<LabReport> findByDoctorId(Long doctorId);
}
