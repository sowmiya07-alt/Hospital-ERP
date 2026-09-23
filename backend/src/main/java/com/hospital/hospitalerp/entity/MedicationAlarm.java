package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medication_alarms")
public class MedicationAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Alarm belongs to a specific patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Alarm is connected to a prescription
    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    // Example: "08:00"
    private String alarmTime;

    // ON / OFF
    private boolean active;

    public MedicationAlarm() {
    }

    public MedicationAlarm(
            Long id,
            Patient patient,
            Prescription prescription,
            String alarmTime,
            boolean active) {

        this.id = id;
        this.patient = patient;
        this.prescription = prescription;
        this.alarmTime = alarmTime;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(
            Prescription prescription) {
        this.prescription = prescription;
    }

    public String getAlarmTime() {
        return alarmTime;
    }

    public void setAlarmTime(String alarmTime) {
        this.alarmTime = alarmTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
