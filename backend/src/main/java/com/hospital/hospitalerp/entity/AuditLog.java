package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String userRole;
    private String action; // CREATE, UPDATE, DELETE, DISPENSE, CHECK_IN, CONSULTATION, PAYMENT
    private String entityName; // Patient, Appointment, Prescription, Billing, Doctor, LabReport
    private String entityId;
    private String timestamp;

    @Column(length = 1000)
    private String details;

    public AuditLog() {
    }

    public AuditLog(Long id, String username, String userRole, String action, String entityName, String entityId, String timestamp, String details) {
        this.id = id;
        this.username = username;
        this.userRole = userRole;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.timestamp = timestamp;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
