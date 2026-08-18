package com.hospital.hospitalerp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;
    private String dosage;
    private String manufacturer;

    // Integer prevents null-to-int deserialization problems
    private Integer stock;

    private String genericName;
    private String category = "Tablet";
    private Double unitPrice = 5.0;
    private String batchNumber;
    private String expiryDate;
    private Integer reorderLevel = 15;

    // ACTIVE, DISCONTINUED
    private String status = "ACTIVE";

    public Medicine() {
    }

    public Medicine(
            Long id,
            String medicineName,
            String dosage,
            String manufacturer,
            Integer stock) {

        this.id = id;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.manufacturer = manufacturer;
        this.stock = stock;
    }

    public Medicine(Long id, String medicineName, String genericName, String dosage,
                    String category, String manufacturer, Integer stock, Double unitPrice,
                    String batchNumber, String expiryDate, Integer reorderLevel) {
        this.id = id;
        this.medicineName = medicineName;
        this.genericName = genericName;
        this.dosage = dosage;
        this.category = category;
        this.manufacturer = manufacturer;
        this.stock = stock;
        this.unitPrice = unitPrice;
        this.batchNumber = batchNumber;
        this.expiryDate = expiryDate;
        this.reorderLevel = reorderLevel != null ? reorderLevel : 15;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockQuantity() {
        return stock != null ? stock : 0;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stock = stockQuantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}