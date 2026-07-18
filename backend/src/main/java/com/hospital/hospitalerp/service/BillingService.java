package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.dto.BillingRequest;
import com.hospital.hospitalerp.entity.Billing;
import com.hospital.hospitalerp.entity.Patient;
import com.hospital.hospitalerp.repository.BillingRepository;
import com.hospital.hospitalerp.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private PatientRepository patientRepository;

    // ==========================================
    // CREATE BILL
    // ==========================================

    public Billing saveBilling(BillingRequest request) {

        if (request.getPatientId() == null) {
            throw new RuntimeException(
                    "Patient ID is required"
            );
        }

        Patient patient = patientRepository
                .findById(request.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );

        if (request.getAmount() == null) {
            throw new RuntimeException(
                    "Billing amount is required"
            );
        }

        Billing billing = new Billing();

        billing.setPatient(patient);
        billing.setAmount(request.getAmount());

        // Default new bill to Pending
        String status = request.getPaymentStatus();

        if (status == null || status.trim().isEmpty()) {
            status = "Pending";
        }

        billing.setPaymentStatus(status);

        // Automatically set payment date if Paid
        if ("Paid".equalsIgnoreCase(status)) {

            billing.setPaymentDate(
                    LocalDate.now().toString()
            );

        } else {

            billing.setPaymentDate(null);
        }

        return billingRepository.save(billing);
    }


    // ==========================================
    // GET ALL BILLS - ADMIN
    // ==========================================

    public List<Billing> getAllBillings() {

        return billingRepository.findAll();
    }


    // ==========================================
    // GET BILL BY ID
    // ==========================================

    public Billing getBillingById(Long id) {

        return billingRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // GET BILLS FOR ONE PATIENT
    // ==========================================

    public List<Billing> getBillingsByPatientId(
            Long patientId) {

        return billingRepository
                .findByPatientId(patientId);
    }


    // ==========================================
    // UPDATE BILL
    // ==========================================

    public Billing updateBilling(
            Long id,
            BillingRequest request) {

        Billing existing =
                billingRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Billing not found"
                                )
                        );

        // Update patient if provided
        if (request.getPatientId() != null) {

            Patient patient =
                    patientRepository
                            .findById(
                                    request.getPatientId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Patient not found"
                                    )
                            );

            existing.setPatient(patient);
        }

        // Update amount if provided
        if (request.getAmount() != null) {

            existing.setAmount(
                    request.getAmount()
            );
        }

        // Update payment status
        if (
                request.getPaymentStatus() != null &&
                !request.getPaymentStatus()
                        .trim()
                        .isEmpty()
        ) {

            String newStatus =
                    request.getPaymentStatus();

            existing.setPaymentStatus(
                    newStatus
            );

            // Automatically add today's date
            // when payment becomes Paid

            if (
                    "Paid".equalsIgnoreCase(
                            newStatus
                    )
            ) {

                existing.setPaymentDate(
                        LocalDate.now().toString()
                );

            } else {

                existing.setPaymentDate(null);
            }
        }

        return billingRepository.save(existing);
    }


    // ==========================================
    // DELETE BILL
    // ==========================================

    public String deleteBilling(Long id) {

        if (!billingRepository.existsById(id)) {

            return "Billing Not Found";
        }

        billingRepository.deleteById(id);

        return "Billing Deleted Successfully";
    }
}