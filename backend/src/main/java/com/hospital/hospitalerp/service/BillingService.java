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

        Billing billing = new Billing();
        billing.setPatient(patient);

        double consult = request.getConsultationFee() != null ? request.getConsultationFee() : 0.0;
        double pharm = request.getPharmacyFee() != null ? request.getPharmacyFee() : 0.0;
        double room = request.getRoomFee() != null ? request.getRoomFee() : 0.0;
        double lab = request.getLabFee() != null ? request.getLabFee() : 0.0;
        double tax = request.getTaxAmount() != null ? request.getTaxAmount() : 0.0;
        double discount = request.getDiscountAmount() != null ? request.getDiscountAmount() : 0.0;

        double baseAmount = request.getAmount() != null ? request.getAmount() : (consult + pharm + room + lab);
        double total = Math.max(0.0, baseAmount + tax - discount);
        double paid = request.getPaidAmount() != null ? request.getPaidAmount() : 0.0;

        billing.setConsultationFee(consult);
        billing.setPharmacyFee(pharm);
        billing.setRoomFee(room);
        billing.setLabFee(lab);
        billing.setTaxAmount(tax);
        billing.setDiscountAmount(discount);
        billing.setAmount(baseAmount);
        billing.setTotalAmount(total);
        billing.setPaidAmount(paid);
        billing.setBalanceAmount(Math.max(0.0, total - paid));
        billing.setPaymentMode(request.getPaymentMode() != null ? request.getPaymentMode() : "CASH");
        billing.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);

        String status = request.getPaymentStatus();
        if (status == null || status.trim().isEmpty()) {
            status = (paid >= total && total > 0) ? "Paid" : (paid > 0 ? "Partial" : "Pending");
        }
        billing.setPaymentStatus(status);

        if ("Paid".equalsIgnoreCase(status)) {
            billing.setPaymentDate(LocalDate.now().toString());
        } else {
            billing.setPaymentDate(null);
        }

        return billingRepository.save(billing);
    }

    public List<Billing> getAllBillings() {
        return billingRepository.findAll();
    }

    public Billing getBillingById(Long id) {
        return billingRepository.findById(id).orElse(null);
    }

    public List<Billing> getBillingsByPatientId(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    public Billing updateBilling(Long id, BillingRequest request) {

        Billing existing = billingRepository.findById(id).orElseThrow(() -> new RuntimeException("Billing not found"));

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            existing.setPatient(patient);
        }

        if (request.getConsultationFee() != null) existing.setConsultationFee(request.getConsultationFee());
        if (request.getPharmacyFee() != null) existing.setPharmacyFee(request.getPharmacyFee());
        if (request.getRoomFee() != null) existing.setRoomFee(request.getRoomFee());
        if (request.getLabFee() != null) existing.setLabFee(request.getLabFee());
        if (request.getTaxAmount() != null) existing.setTaxAmount(request.getTaxAmount());
        if (request.getDiscountAmount() != null) existing.setDiscountAmount(request.getDiscountAmount());
        if (request.getPaidAmount() != null) existing.setPaidAmount(request.getPaidAmount());
        if (request.getPaymentMode() != null) existing.setPaymentMode(request.getPaymentMode());

        double total = (existing.getConsultationFee() + existing.getPharmacyFee() + existing.getRoomFee() + existing.getLabFee()) + existing.getTaxAmount() - existing.getDiscountAmount();
        if (request.getAmount() != null && request.getAmount() > 0) {
            existing.setAmount(request.getAmount());
            total = request.getAmount() + existing.getTaxAmount() - existing.getDiscountAmount();
        } else {
            existing.setAmount(total);
        }

        existing.setTotalAmount(total);
        existing.setBalanceAmount(Math.max(0.0, total - existing.getPaidAmount()));

        if (request.getPaymentStatus() != null && !request.getPaymentStatus().trim().isEmpty()) {
            String newStatus = request.getPaymentStatus();
            existing.setPaymentStatus(newStatus);
            if ("Paid".equalsIgnoreCase(newStatus)) {
                existing.setPaidAmount(total);
                existing.setBalanceAmount(0.0);
                existing.setPaymentDate(LocalDate.now().toString());
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