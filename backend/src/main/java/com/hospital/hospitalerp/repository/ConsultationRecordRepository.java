package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.ConsultationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRecordRepository extends JpaRepository<ConsultationRecord, Long> {
    List<ConsultationRecord> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<ConsultationRecord> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    Optional<ConsultationRecord> findByAppointmentId(Long appointmentId);
}
