package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Doctor;
import com.hospital.hospitalerp.service.DoctorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // CREATE DOCTOR
    // This also creates the doctor's login account
    @PostMapping
    public Doctor addDoctor(
            @RequestBody Doctor doctor) {

        return doctorService.saveDoctor(doctor);
    }

    // GET ALL DOCTORS
    @GetMapping
    public List<Doctor> getAllDoctors() {

        return doctorService.getAllDoctors();
    }

    // GET DOCTOR BY ID
    @GetMapping("/{id}")
    public Doctor getDoctorById(
            @PathVariable Long id) {

        return doctorService.getDoctorById(id);
    }

    // UPDATE DOCTOR
    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        return doctorService.updateDoctor(
                id,
                doctor
        );
    }

    // DELETE DOCTOR
    @DeleteMapping("/{id}")
    public String deleteDoctor(
            @PathVariable Long id) {

        return doctorService.deleteDoctor(id);
    }
}