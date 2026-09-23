package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository
        extends JpaRepository<Billing, Long> {

    // GET BILLING RECORDS FOR ONE PATIENT
    List<Billing> findByPatientId(Long patientId);
}