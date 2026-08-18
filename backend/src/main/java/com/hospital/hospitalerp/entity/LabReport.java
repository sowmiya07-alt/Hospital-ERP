package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_reports")
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String testName;

    // ROUTINE, URGENT, EMERGENCY
    private String priority = "ROUTINE";

    // REQUESTED, SAMPLE_COLLECTED, PROCESSING, COMPLETED, CANCELLED
    private String status = "REQUESTED";

    @Column(length = 2000)
    private String result;

    private String requestedDate;
    private String sampleCollectedDate;
    private String reportDate;
    private Double cost = 100.0;
    private String testCode;

    public LabReport() {
    }

    public LabReport(Long id, Patient patient, Doctor doctor, String testName, String priority, String status, Double cost) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.testName = testName;
        this.priority = priority;
        this.status = status;
        this.cost = cost;
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

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(String requestedDate) {
        this.requestedDate = requestedDate;
    }

    public String getSampleCollectedDate() {
        return sampleCollectedDate;
    }

    public void setSampleCollectedDate(String sampleCollectedDate) {
        this.sampleCollectedDate = sampleCollectedDate;
    }

    public String getReportDate() {
        return reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getTestCode() {
        if (testCode != null && !testCode.trim().isEmpty()) {
            return testCode;
        }
        if (id != null) {
            return String.format("LAB-2026-%06d", id);
        }
        return null;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }
}
