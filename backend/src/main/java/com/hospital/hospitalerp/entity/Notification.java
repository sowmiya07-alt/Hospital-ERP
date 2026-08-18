package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PATIENT, DOCTOR, ADMIN, ALL
    private String recipientRole;
    private String recipientUsername;

    private String title;
    @Column(length = 1000)
    private String message;

    private String timestamp;
    private boolean readStatus = false;

    // APPOINTMENT, PRESCRIPTION, LAB, BILLING, SYSTEM
    private String type = "SYSTEM";

    public Notification() {
    }

    public Notification(Long id, String recipientRole, String recipientUsername, String title, String message, String timestamp, String type) {
        this.id = id;
        this.recipientRole = recipientRole;
        this.recipientUsername = recipientUsername;
        this.title = title;
        this.message = message;
        this.timestamp = timestamp;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
