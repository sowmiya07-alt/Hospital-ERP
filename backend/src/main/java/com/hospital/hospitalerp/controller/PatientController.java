package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // Create Patient
    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    // Get All Patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Get Patient By ID
    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    // Update Patient
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }

    // Delete Patient
    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        return patientService.deletePatient(id);
    }
}