package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.dto.BillingRequest;
import com.hospital.hospitalerp.entity.Billing;
import com.hospital.hospitalerp.service.BillingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    // CREATE BILLING
    @PostMapping
    public Billing addBilling(
            @RequestBody BillingRequest request) {

        return billingService.saveBilling(request);
    }

    // GET ALL BILLINGS - ADMIN
    @GetMapping
    public List<Billing> getAllBillings() {

        return billingService.getAllBillings();
    }

    // GET BILLINGS FOR ONE PATIENT
    @GetMapping("/patient/{patientId}")
    public List<Billing> getBillingsByPatient(
            @PathVariable Long patientId) {

        return billingService
                .getBillingsByPatientId(patientId);
    }

    // GET BILLING BY ID
    @GetMapping("/{id}")
    public Billing getBillingById(
            @PathVariable Long id) {

        return billingService.getBillingById(id);
    }

    // UPDATE BILLING
    @PutMapping("/{id}")
    public Billing updateBilling(
            @PathVariable Long id,
            @RequestBody BillingRequest request) {

        return billingService
                .updateBilling(id, request);
    }

    // DELETE BILLING
    @DeleteMapping("/{id}")
    public String deleteBilling(
            @PathVariable Long id) {

        return billingService.deleteBilling(id);
    }
}