package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.*;
import com.hospital.hospitalerp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GlobalSearchService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private LabReportRepository labReportRepository;

    public Map<String, Object> searchAll(String query) {
        Map<String, Object> results = new HashMap<>();
        if (query == null || query.trim().isEmpty()) {
            results.put("patients", Collections.emptyList());
            results.put("doctors", Collections.emptyList());
            results.put("appointments", Collections.emptyList());
            results.put("prescriptions", Collections.emptyList());
            results.put("billings", Collections.emptyList());
            results.put("labReports", Collections.emptyList());
            return results;
        }

        String q = query.trim().toLowerCase();

        // Patients
        List<Patient> matchedPatients = patientRepository.findAll().stream()
                .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                        (p.getPhone() != null && p.getPhone().contains(q)) ||
                        (p.getPatientCode() != null && p.getPatientCode().toLowerCase().contains(q)))
                .toList();

        // Doctors
        List<Doctor> matchedDoctors = doctorRepository.findAll().stream()
                .filter(d -> (d.getName() != null && d.getName().toLowerCase().contains(q)) ||
                        (d.getSpecialization() != null && d.getSpecialization().toLowerCase().contains(q)) ||
                        (d.getDoctorCode() != null && d.getDoctorCode().toLowerCase().contains(q)))
                .toList();

        // Appointments
        List<Appointment> matchedAppointments = appointmentRepository.findAll().stream()
                .filter(a -> (a.getAppointmentCode() != null && a.getAppointmentCode().toLowerCase().contains(q)) ||
                        (a.getPatient() != null && a.getPatient().getName() != null && a.getPatient().getName().toLowerCase().contains(q)) ||
                        (a.getDoctor() != null && a.getDoctor().getName() != null && a.getDoctor().getName().toLowerCase().contains(q)))
                .toList();

        // Prescriptions
        List<Prescription> matchedPrescriptions = prescriptionRepository.findAll().stream()
                .filter(p -> (p.getPrescriptionCode() != null && p.getPrescriptionCode().toLowerCase().contains(q)) ||
                        (p.getMedicine() != null && p.getMedicine().getMedicineName() != null && p.getMedicine().getMedicineName().toLowerCase().contains(q)))
                .toList();

        // Billings
        List<Billing> matchedBillings = billingRepository.findAll().stream()
                .filter(b -> (b.getInvoiceNumber() != null && b.getInvoiceNumber().toLowerCase().contains(q)) ||
                        (b.getPatient() != null && b.getPatient().getName() != null && b.getPatient().getName().toLowerCase().contains(q)))
                .toList();

        // Labs
        List<LabReport> matchedLabs = labReportRepository.findAll().stream()
                .filter(l -> (l.getTestCode() != null && l.getTestCode().toLowerCase().contains(q)) ||
                        (l.getTestName() != null && l.getTestName().toLowerCase().contains(q)))
                .toList();

        results.put("patients", matchedPatients);
        results.put("doctors", matchedDoctors);
        results.put("appointments", matchedAppointments);
        results.put("prescriptions", matchedPrescriptions);
        results.put("billings", matchedBillings);
        results.put("labReports", matchedLabs);

        return results;
    }
}
