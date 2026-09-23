package com.hospital.hospitalerp.dto;

public class ForgotPasswordRequest {
    private String usernameOrEmail;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }
}
