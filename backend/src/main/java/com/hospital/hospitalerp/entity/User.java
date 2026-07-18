package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    // Links a DOCTOR login account to a Doctor record
    @OneToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // Links a PATIENT login account to a Patient record
    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // Default Constructor
    public User() {
    }

    // Constructor used for creating users
    public User(
            Long id,
            String username,
            String password,
            String role) {

        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // ID

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // USERNAME

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // PASSWORD

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ROLE

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // DOCTOR

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    // PATIENT

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}