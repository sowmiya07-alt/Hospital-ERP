package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Appointment;
import com.hospital.hospitalerp.entity.ConsultationRecord;
import com.hospital.hospitalerp.entity.Doctor;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.repository.AppointmentRepository;
import com.hospital.hospitalerp.repository.ConsultationRecordRepository;
import com.hospital.hospitalerp.repository.DoctorRepository;
import com.hospital.hospitalerp.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConsultationRecordService {

    @Autowired
    private ConsultationRecordRepository consultationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<ConsultationRecord> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public List<ConsultationRecord> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<ConsultationRecord> getConsultationsByDoctor(Long doctorId) {
        return consultationRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }

    public ConsultationRecord getConsultationByAppointment(Long appointmentId) {
        return consultationRepository.findByAppointmentId(appointmentId).orElse(null);
    }

    @Transactional
    public ConsultationRecord createOrUpdateConsultation(ConsultationRecord record) {
        if (record.getPatient() != null && record.getPatient().getId() != null) {
            Patient p = patientRepository.findById(record.getPatient().getId()).orElse(null);
            record.setPatient(p);
        }
        if (record.getDoctor() != null && record.getDoctor().getId() != null) {
            Doctor d = doctorRepository.findById(record.getDoctor().getId()).orElse(null);
            record.setDoctor(d);
        }
        if (record.getAppointment() != null && record.getAppointment().getId() != null) {
            Appointment appt = appointmentRepository.findById(record.getAppointment().getId()).orElse(null);
            record.setAppointment(appt);
            if (appt != null) {
                appt.setStatus("Completed");
                appointmentRepository.save(appt);
            }
        }
        return consultationRepository.save(record);
    }
}
