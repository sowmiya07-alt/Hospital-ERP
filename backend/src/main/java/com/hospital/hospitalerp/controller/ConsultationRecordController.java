package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.ConsultationRecord;
import com.hospital.hospitalerp.service.ConsultationRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultations")
public class ConsultationRecordController {

    @Autowired
    private ConsultationRecordService consultationService;

    @GetMapping
    public List<ConsultationRecord> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @GetMapping("/patient/{patientId}")
    public List<ConsultationRecord> getByPatient(@PathVariable Long patientId) {
        return consultationService.getConsultationsByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<ConsultationRecord> getByDoctor(@PathVariable Long doctorId) {
        return consultationService.getConsultationsByDoctor(doctorId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ConsultationRecord getByAppointment(@PathVariable Long appointmentId) {
        return consultationService.getConsultationByAppointment(appointmentId);
    }

    @PostMapping
    public ConsultationRecord createConsultation(@RequestBody ConsultationRecord record) {
        return consultationService.createOrUpdateConsultation(record);
    }
}
