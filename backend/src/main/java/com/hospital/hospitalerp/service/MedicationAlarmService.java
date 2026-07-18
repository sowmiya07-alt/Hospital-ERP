package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.MedicationAlarm;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.Prescription;

import com.hospital.hospitalerp.repository.MedicationAlarmRepository;
import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.PrescriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationAlarmService {

    @Autowired
    private MedicationAlarmRepository medicationAlarmRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;


    // CREATE MEDICATION ALARM
    public MedicationAlarm createAlarm(
            Long patientId,
            Long prescriptionId,
            String alarmTime) {

        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Prescription prescription = prescriptionRepository
                .findById(prescriptionId)
                .orElseThrow(() ->
                        new RuntimeException("Prescription not found"));

        // Security/data check:
        // Prescription must belong to this patient
        if (prescription.getPatient() == null ||
                !prescription.getPatient().getId().equals(patientId)) {

            throw new RuntimeException(
                    "This prescription does not belong to this patient"
            );
        }

        if (alarmTime == null || alarmTime.trim().isEmpty()) {
            throw new RuntimeException("Alarm time is required");
        }

        MedicationAlarm alarm = new MedicationAlarm();

        alarm.setPatient(patient);
        alarm.setPrescription(prescription);
        alarm.setAlarmTime(alarmTime);
        alarm.setActive(true);

        return medicationAlarmRepository.save(alarm);
    }


    // GET ALL ALARMS FOR ONE PATIENT
    public List<MedicationAlarm> getAlarmsByPatientId(
            Long patientId) {

        return medicationAlarmRepository
                .findByPatientId(patientId);
    }


    // TURN ALARM ON / OFF
    public MedicationAlarm toggleAlarm(Long alarmId) {

        MedicationAlarm alarm = medicationAlarmRepository
                .findById(alarmId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medication alarm not found"
                        ));

        alarm.setActive(!alarm.isActive());

        return medicationAlarmRepository.save(alarm);
    }


    // DELETE ALARM
    public String deleteAlarm(Long alarmId) {

        if (!medicationAlarmRepository.existsById(alarmId)) {
            return "Medication Alarm Not Found";
        }

        medicationAlarmRepository.deleteById(alarmId);

        return "Medication Alarm Deleted Successfully";
    }
}