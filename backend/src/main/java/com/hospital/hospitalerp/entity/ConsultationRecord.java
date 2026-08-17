package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_records")
public class ConsultationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(length = 1000)
    private String chiefComplaint;

    @Column(length = 1000)
    private String symptoms;

    @Column(length = 1000)
    private String diagnosis;

    // Vitals
    private String bloodPressure;
    private String temperature;
    private String pulse;
    private String weight;
    private String oxygenSaturation;

    @Column(length = 2000)
    private String clinicalNotes;

    private String followUpDate;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ConsultationRecord() {
    }

    public ConsultationRecord(Long id, Patient patient, Doctor doctor, Appointment appointment,
                              String chiefComplaint, String symptoms, String diagnosis,
                              String bloodPressure, String temperature, String pulse,
                              String weight, String oxygenSaturation, String clinicalNotes,
                              String followUpDate) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.appointment = appointment;
        this.chiefComplaint = chiefComplaint;
        this.symptoms = symptoms;
        this.diagnosis = diagnosis;
        this.bloodPressure = bloodPressure;
        this.temperature = temperature;
        this.pulse = pulse;
        this.weight = weight;
        this.oxygenSaturation = oxygenSaturation;
        this.clinicalNotes = clinicalNotes;
        this.followUpDate = followUpDate;
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

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getChiefComplaint() {
        return chiefComplaint;
    }

    public void setChiefComplaint(String chiefComplaint) {
        this.chiefComplaint = chiefComplaint;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getPulse() {
        return pulse;
    }

    public void setPulse(String pulse) {
        this.pulse = pulse;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(String oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public String getClinicalNotes() {
        return clinicalNotes;
    }

    public void setClinicalNotes(String clinicalNotes) {
        this.clinicalNotes = clinicalNotes;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(String followUpDate) {
        this.followUpDate = followUpDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
