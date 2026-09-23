package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admissions")
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "bed_id")
    private Bed bed;

    private String admissionDate;
    private String dischargeDate;

    // ADMITTED, DISCHARGED, TRANSFERRED
    private String status = "ADMITTED";

    private String reason;
    private Double totalRoomCharges = 0.0;
    private String admissionCode;

    public Admission() {
    }

    public Admission(Long id, Patient patient, Doctor doctor, Bed bed, String admissionDate, String status, String reason) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.bed = bed;
        this.admissionDate = admissionDate;
        this.status = status;
        this.reason = reason;
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

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }

    public String getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(String admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getDischargeDate() {
        return dischargeDate;
    }

    public void setDischargeDate(String dischargeDate) {
        this.dischargeDate = dischargeDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Double getTotalRoomCharges() {
        return totalRoomCharges;
    }

    public void setTotalRoomCharges(Double totalRoomCharges) {
        this.totalRoomCharges = totalRoomCharges;
    }

    public String getAdmissionCode() {
        if (admissionCode != null && !admissionCode.trim().isEmpty()) {
            return admissionCode;
        }
        if (id != null) {
            return String.format("ADM-2026-%06d", id);
        }
        return null;
    }

    public void setAdmissionCode(String admissionCode) {
        this.admissionCode = admissionCode;
    }
}
