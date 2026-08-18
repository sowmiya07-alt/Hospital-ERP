package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Admission;
import com.hospital.hospitalerp.entity.Bed;
import com.hospital.hospitalerp.repository.AdmissionRepository;
import com.hospital.hospitalerp.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public Bed createBed(Bed bed) {
        return bedRepository.save(bed);
    }

    @Transactional
    public Admission admitPatient(Admission admission) {
        if (admission.getAdmissionDate() == null) {
            admission.setAdmissionDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        admission.setStatus("ADMITTED");

        // Occupy Bed
        if (admission.getBed() != null && admission.getBed().getId() != null) {
            Optional<Bed> optionalBed = bedRepository.findById(admission.getBed().getId());
            if (optionalBed.isPresent()) {
                Bed bed = optionalBed.get();
                bed.setStatus("OCCUPIED");
                bedRepository.save(bed);
                admission.setBed(bed);
            }
        }

        Admission saved = admissionRepository.save(admission);

        notificationService.createNotification(
                "ADMIN", null, "🛏️ New Inpatient Admission",
                "Patient admitted to Room " + (saved.getBed() != null ? saved.getBed().getRoomNumber() : "N/A"),
                "ADMISSION"
        );

        auditLogService.logAction("SYSTEM", "STAFF", "CREATE", "Admission", String.valueOf(saved.getId()),
                "Admitted patient to bed");

        return saved;
    }

    @Transactional
    public Admission dischargePatient(Long admissionId) {
        Optional<Admission> optional = admissionRepository.findById(admissionId);
        if (optional.isPresent()) {
            Admission admission = optional.get();
            admission.setStatus("DISCHARGED");
            admission.setDischargeDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

            // Release Bed
            if (admission.getBed() != null) {
                Bed bed = admission.getBed();
                bed.setStatus("AVAILABLE");
                bedRepository.save(bed);
            }

            Admission updated = admissionRepository.save(admission);

            auditLogService.logAction("SYSTEM", "STAFF", "UPDATE", "Admission", String.valueOf(updated.getId()),
                    "Discharged patient and released bed");

            return updated;
        }
        return null;
    }
}
