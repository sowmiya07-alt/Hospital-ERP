package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Appointment;
import com.hospital.hospitalerp.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    // CREATE APPOINTMENT
    @PostMapping
    public Appointment addAppointment(
            @RequestBody Appointment appointment) {

        return appointmentService
                .saveAppointment(appointment);
    }


    // GET ALL APPOINTMENTS - ADMIN
    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService
                .getAllAppointments();
    }


    // GET APPOINTMENT BY ID
    @GetMapping("/{id}")
    public Appointment getAppointmentById(
            @PathVariable Long id) {

        return appointmentService
                .getAppointmentById(id);
    }


    // GET APPOINTMENTS FOR A SPECIFIC DOCTOR
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(
            @PathVariable Long doctorId) {

        return appointmentService
                .getAppointmentsByDoctorId(doctorId);
    }


    // GET APPOINTMENTS FOR A SPECIFIC PATIENT
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(
            @PathVariable Long patientId) {

        return appointmentService
                .getAppointmentsByPatientId(patientId);
    }


    // UPDATE APPOINTMENT
    @PutMapping("/{id}")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return appointmentService
                .updateAppointment(id, appointment);
    }


    // DELETE APPOINTMENT
    @DeleteMapping("/{id}")
    public String deleteAppointment(
            @PathVariable Long id) {

        return appointmentService
                .deleteAppointment(id);
    }
}