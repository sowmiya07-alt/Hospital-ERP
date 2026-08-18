package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "beds")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String bedNumber;
    private String wardType = "GENERAL"; // GENERAL, ICU, PRIVATE, SEMI_PRIVATE

    // AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE
    private String status = "AVAILABLE";

    private Double dailyRate = 500.0;

    public Bed() {
    }

    public Bed(Long id, String roomNumber, String bedNumber, String wardType, String status, Double dailyRate) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.bedNumber = bedNumber;
        this.wardType = wardType;
        this.status = status;
        this.dailyRate = dailyRate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    public String getWardType() {
        return wardType;
    }

    public void setWardType(String wardType) {
        this.wardType = wardType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }
}
