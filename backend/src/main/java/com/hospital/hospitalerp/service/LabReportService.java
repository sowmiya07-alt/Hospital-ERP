package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.LabReport;
import com.hospital.hospitalerp.repository.LabReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class LabReportService {

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    public List<LabReport> getAllLabReports() {
        return labReportRepository.findAll();
    }

    public List<LabReport> getLabReportsByPatient(Long patientId) {
        return labReportRepository.findByPatientId(patientId);
    }

    public List<LabReport> getLabReportsByDoctor(Long doctorId) {
        return labReportRepository.findByDoctorId(doctorId);
    }

    public LabReport createLabReport(LabReport labReport) {
        if (labReport.getRequestedDate() == null) {
            labReport.setRequestedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        if (labReport.getStatus() == null) {
            labReport.setStatus("REQUESTED");
        }
        LabReport saved = labReportRepository.save(labReport);

        if (saved.getPatient() != null) {
            notificationService.createNotification(
                    "PATIENT",
                    null,
                    "🧪 New Lab Test Requested",
                    "Lab test '" + saved.getTestName() + "' requested by doctor.",
                    "LAB"
            );
        }

        auditLogService.logAction("SYSTEM", "STAFF", "CREATE", "LabReport", String.valueOf(saved.getId()),
                "Lab test requested: " + saved.getTestName());

        return saved;
    }

    public LabReport updateLabReportStatus(Long id, String status, String result) {
        Optional<LabReport> optional = labReportRepository.findById(id);
        if (optional.isPresent()) {
            LabReport lab = optional.get();
            lab.setStatus(status);
            if (result != null) {
                lab.setResult(result);
            }
            if ("SAMPLE_COLLECTED".equals(status)) {
                lab.setSampleCollectedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            } else if ("COMPLETED".equals(status)) {
                lab.setReportDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            }
            LabReport updated = labReportRepository.save(lab);

            auditLogService.logAction("SYSTEM", "STAFF", "UPDATE", "LabReport", String.valueOf(updated.getId()),
                    "Updated lab status to " + status);
            return updated;
        }
        return null;
    }
}
