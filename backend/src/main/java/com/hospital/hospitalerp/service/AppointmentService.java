package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Appointment;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.Doctor;

import com.hospital.hospitalerp.repository.AppointmentRepository;
import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.DoctorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    // ==============================
    // CREATE APPOINTMENT
    // ==============================

    public Appointment saveAppointment(
            Appointment appointment) {

        if (appointment.getPatient() == null ||
                appointment.getPatient().getId() == null) {

            throw new RuntimeException(
                    "Patient is required"
            );
        }

        if (appointment.getDoctor() == null ||
                appointment.getDoctor().getId() == null) {

            throw new RuntimeException(
                    "Doctor is required"
            );
        }

        Long patientId =
                appointment.getPatient().getId();

        Long doctorId =
                appointment.getDoctor().getId();


        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );


        Doctor doctor = doctorRepository
                .findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );


        appointment.setPatient(patient);

        appointment.setDoctor(doctor);


        return appointmentRepository
                .save(appointment);
    }


    // ==============================
    // GET ALL APPOINTMENTS
    // ==============================

    public List<Appointment>
    getAllAppointments() {

        return appointmentRepository.findAll();
    }


    // ==============================
    // GET APPOINTMENT BY ID
    // ==============================

    public Appointment getAppointmentById(
            Long id) {

        return appointmentRepository
                .findById(id)
                .orElse(null);
    }


    // ==============================
    // GET APPOINTMENTS BY DOCTOR
    // ==============================

    public List<Appointment>
    getAppointmentsByDoctorId(Long doctorId) {

        return appointmentRepository
                .findByDoctorId(doctorId);
    }


    // ==============================
    // GET APPOINTMENTS BY PATIENT
    // ==============================

    public List<Appointment>
    getAppointmentsByPatientId(Long patientId) {

        return appointmentRepository
                .findByPatientId(patientId);
    }


    // ==============================
    // UPDATE APPOINTMENT
    // ==============================

    public Appointment updateAppointment(
            Long id,
            Appointment appointment) {

        Appointment existing =
                appointmentRepository
                        .findById(id)
                        .orElse(null);


        if (existing == null) {

            return null;
        }


        // UPDATE PATIENT

        if (appointment.getPatient() != null &&
                appointment
                        .getPatient()
                        .getId() != null) {

            Long patientId =
                    appointment
                            .getPatient()
                            .getId();


            Patient patient =
                    patientRepository
                            .findById(patientId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Patient not found"
                                    )
                            );


            existing.setPatient(patient);
        }


        // UPDATE DOCTOR

        if (appointment.getDoctor() != null &&
                appointment
                        .getDoctor()
                        .getId() != null) {

            Long doctorId =
                    appointment
                            .getDoctor()
                            .getId();


            Doctor doctor =
                    doctorRepository
                            .findById(doctorId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Doctor not found"
                                    )
                            );


            existing.setDoctor(doctor);
        }


        existing.setAppointmentDate(
                appointment.getAppointmentDate()
        );


        existing.setAppointmentTime(
                appointment.getAppointmentTime()
        );


        existing.setStatus(
                appointment.getStatus()
        );


        return appointmentRepository
                .save(existing);
    }


    // ==============================
    // DELETE APPOINTMENT
    // ==============================

    public String deleteAppointment(Long id) {

        if (!appointmentRepository
                .existsById(id)) {

            return "Appointment Not Found";
        }


        appointmentRepository.deleteById(id);


        return "Appointment Deleted Successfully";
    }
}