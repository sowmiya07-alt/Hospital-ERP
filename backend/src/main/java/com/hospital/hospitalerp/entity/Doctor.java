package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String phone;
    private String email;

    private Integer experience;
    private String qualification;
    private Double consultationFee = 50.0;
    private String availableDays = "Mon,Tue,Wed,Thu,Fri";

    // ACTIVE, INACTIVE
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public Doctor() {
    }

    public Doctor(Long id, String name,
                  String specialization,
                  String phone,
                  String email,
                  Integer experience) {

        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
        this.experience = experience;
    }

    public Doctor(Long id, String name, String specialization, String qualification,
                  String phone, String email, Integer experience, Double consultationFee,
                  Department department, String status) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.qualification = qualification;
        this.phone = phone;
        this.email = email;
        this.experience = experience;
        this.consultationFee = consultationFee;
        this.department = department;
        this.status = status != null ? status : "ACTIVE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    private String doctorCode;

    public String getDoctorCode() {
        if (doctorCode != null && !doctorCode.trim().isEmpty()) {
            return doctorCode;
        }
        if (id != null) {
            return String.format("DOC-2026-%06d", id);
        }
        return null;
    }

    public void setDoctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
    }
}