package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.MedicationAlarm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationAlarmRepository
        extends JpaRepository<MedicationAlarm, Long> {

    // Get all medication alarms for one patient
    List<MedicationAlarm> findByPatientId(Long patientId);

}