package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Admission;
import com.hospital.hospitalerp.entity.Bed;
import com.hospital.hospitalerp.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @GetMapping
    public List<Admission> getAllAdmissions() {
        return admissionService.getAllAdmissions();
    }

    @GetMapping("/beds")
    public List<Bed> getAllBeds() {
        return admissionService.getAllBeds();
    }

    @PostMapping("/beds")
    public Bed createBed(@RequestBody Bed bed) {
        return admissionService.createBed(bed);
    }

    @PostMapping("/admit")
    public Admission admitPatient(@RequestBody Admission admission) {
        return admissionService.admitPatient(admission);
    }

    @PutMapping("/{id}/discharge")
    public Admission dischargePatient(@PathVariable Long id) {
        return admissionService.dischargePatient(id);
    }
}
