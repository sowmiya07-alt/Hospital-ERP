package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.LabReport;
import com.hospital.hospitalerp.service.LabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    @GetMapping
    public List<LabReport> getAllLabReports() {
        return labReportService.getAllLabReports();
    }

    @GetMapping("/patient/{patientId}")
    public List<LabReport> getLabReportsByPatient(@PathVariable Long patientId) {
        return labReportService.getLabReportsByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<LabReport> getLabReportsByDoctor(@PathVariable Long doctorId) {
        return labReportService.getLabReportsByDoctor(doctorId);
    }

    @PostMapping
    public LabReport createLabReport(@RequestBody LabReport labReport) {
        return labReportService.createLabReport(labReport);
    }

    @PutMapping("/{id}/status")
    public LabReport updateLabReportStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String result) {
        return labReportService.updateLabReportStatus(id, status, result);
    }
}
