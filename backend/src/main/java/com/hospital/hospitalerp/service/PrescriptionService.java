package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.dto.PrescriptionRequest;
import com.hospital.hospitalerp.entity.Medicine;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.entity.Prescription;
import com.hospital.hospitalerp.repository.MedicineRepository;
import com.hospital.hospitalerp.repository.PatientRepository;
import com.hospital.hospitalerp.repository.PrescriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    // CREATE
    public Prescription savePrescription(PrescriptionRequest request) {

        if (request.getPatientId() == null) {
            throw new RuntimeException("Patient ID is required");
        }

        if (request.getMedicineId() == null) {
            throw new RuntimeException("Medicine ID is required");
        }

        Patient patient = patientRepository
                .findById(request.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Medicine medicine = medicineRepository
                .findById(request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        Prescription prescription = new Prescription();

        prescription.setPatient(patient);
        prescription.setMedicine(medicine);
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());

        if (request.getDuration() != null) {
            prescription.setDuration(request.getDuration());
        }

        return prescriptionRepository.save(prescription);
    }

    // GET ALL
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // GET BY ID
    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository
                .findById(id)
                .orElse(null);
    }

    // UPDATE
    public Prescription updatePrescription(
            Long id,
            PrescriptionRequest request) {

        Prescription existing = prescriptionRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Prescription not found"));

        if (request.getPatientId() != null) {

            Patient patient = patientRepository
                    .findById(request.getPatientId())
                    .orElseThrow(() ->
                            new RuntimeException("Patient not found"));

            existing.setPatient(patient);
        }

        if (request.getMedicineId() != null) {

            Medicine medicine = medicineRepository
                    .findById(request.getMedicineId())
                    .orElseThrow(() ->
                            new RuntimeException("Medicine not found"));

            existing.setMedicine(medicine);
        }

        existing.setDosage(request.getDosage());
        existing.setFrequency(request.getFrequency());

        if (request.getDuration() != null) {
            existing.setDuration(request.getDuration());
        }

        return prescriptionRepository.save(existing);
    }

    // DELETE
    public String deletePrescription(Long id) {

        if (!prescriptionRepository.existsById(id)) {
            return "Prescription Not Found";
        }

        prescriptionRepository.deleteById(id);

        return "Prescription Deleted Successfully";
    }
    // GET PRESCRIPTIONS BY PATIENT ID
public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
    return prescriptionRepository.findByPatientId(patientId);
}
}