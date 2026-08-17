package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.dto.PrescriptionRequest;
import com.hospital.hospitalerp.entity.Prescription;
import com.hospital.hospitalerp.service.PrescriptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    // CREATE
    @PostMapping
    public Prescription addPrescription(
            @RequestBody PrescriptionRequest request) {

        return prescriptionService.savePrescription(request);
    }

    // GET ALL - ADMIN
    @GetMapping
    public List<Prescription> getAllPrescriptions() {

        return prescriptionService.getAllPrescriptions();
    }

    // GET PRESCRIPTIONS FOR ONE PATIENT
    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(
            @PathVariable Long patientId) {

        return prescriptionService
                .getPrescriptionsByPatientId(patientId);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Prescription getPrescriptionById(
            @PathVariable Long id) {

        return prescriptionService.getPrescriptionById(id);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deletePrescription(
            @PathVariable Long id) {

        return prescriptionService.deletePrescription(id);
    }
}