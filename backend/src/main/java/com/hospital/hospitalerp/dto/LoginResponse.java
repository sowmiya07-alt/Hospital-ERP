package com.hospital.hospitalerp.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private String username;
    private String role;
    private Long doctorId;
    private Long patientId;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            String message,
            String username,
            String role,
            Long doctorId,
            Long patientId) {

        this.success = success;
        this.message = message;
        this.username = username;
        this.role = role;
        this.doctorId = doctorId;
        this.patientId = patientId;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
}