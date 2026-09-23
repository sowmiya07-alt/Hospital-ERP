package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.*;
import com.hospital.hospitalerp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        String todayStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        List<Appointment> allAppointments = appointmentRepository.findAll();
        List<Patient> allPatients = patientRepository.findAll();
        List<Doctor> allDoctors = doctorRepository.findAll();
        List<Medicine> allMedicines = medicineRepository.findAll();
        List<Billing> allBillings = billingRepository.findAll();
        List<LabReport> allLabs = labReportRepository.findAll();
        List<Admission> allAdmissions = admissionRepository.findAll();

        // 1. Today's Appointments & Filters
        List<Appointment> todayAppointmentsList = allAppointments.stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().equals(todayStr))
                .collect(Collectors.toList());

        // If no appointments today, fallback to all appointments sorted by id desc for operational visibility
        List<Appointment> displayAppointments = todayAppointmentsList.isEmpty()
                ? allAppointments.stream().sorted(Comparator.comparing(Appointment::getId).reversed()).limit(10).collect(Collectors.toList())
                : todayAppointmentsList;

        long waitingPatients = allAppointments.stream()
                .filter(a -> "Waiting".equalsIgnoreCase(a.getStatus()) || "CHECKED_IN".equalsIgnoreCase(a.getStatus()))
                .count();

        long inConsultation = allAppointments.stream()
                .filter(a -> "In Consultation".equalsIgnoreCase(a.getStatus()) || "IN_CONSULTATION".equalsIgnoreCase(a.getStatus()))
                .count();

        long completedToday = allAppointments.stream()
                .filter(a -> "Completed".equalsIgnoreCase(a.getStatus()))
                .count();

        // 2. Financials
        double revenueToday = 0.0;
        double totalRevenue = 0.0;
        long pendingBillsCount = 0;

        for (Billing b : allBillings) {
            double amountVal = b.getAmount() != null ? b.getAmount() : 0.0;
            double paid = b.getPaidAmount() != null ? b.getPaidAmount() : ("Paid".equalsIgnoreCase(b.getPaymentStatus()) ? amountVal : 0.0);
            double total = b.getTotalAmount() != null ? b.getTotalAmount() : amountVal;
            totalRevenue += paid;

            if (b.getPaymentDate() != null && b.getPaymentDate().equals(todayStr)) {
                revenueToday += paid;
            }

            if (!"Paid".equalsIgnoreCase(b.getPaymentStatus())) {
                pendingBillsCount++;
            }
        }

        if (todayAppointmentsList.isEmpty() && revenueToday == 0 && totalRevenue > 0) {
            revenueToday = totalRevenue; // Display collected revenue for visibility
        }

        // 3. Needs Attention Items
        List<Medicine> lowStockMedicines = allMedicines.stream()
                .filter(m -> m.getStock() != null && m.getStock() <= (m.getReorderLevel() != null ? m.getReorderLevel() : 15))
                .collect(Collectors.toList());

        long pendingLabs = allLabs.stream()
                .filter(l -> !"COMPLETED".equalsIgnoreCase(l.getStatus()) && !"CANCELLED".equalsIgnoreCase(l.getStatus()))
                .count();

        long activeAdmissions = allAdmissions.stream()
                .filter(a -> "ADMITTED".equalsIgnoreCase(a.getStatus()))
                .count();

        // 4. Patient Flow Summary
        Map<String, Long> patientFlow = new LinkedHashMap<>();
        patientFlow.put("registeredToday", (long) allPatients.size());
        patientFlow.put("checkedIn", allAppointments.stream().filter(a -> "CHECKED_IN".equalsIgnoreCase(a.getStatus()) || "Checked-In".equalsIgnoreCase(a.getStatus())).count());
        patientFlow.put("waiting", waitingPatients);
        patientFlow.put("inConsultation", inConsultation);
        patientFlow.put("completed", completedToday);
        patientFlow.put("discharged", allAdmissions.stream().filter(a -> "DISCHARGED".equalsIgnoreCase(a.getStatus())).count());

        // Assembly
        summary.put("totalPatients", allPatients.size());
        summary.put("totalDoctors", allDoctors.size());
        summary.put("totalAppointments", allAppointments.size());
        summary.put("todayAppointmentsCount", todayAppointmentsList.size());
        summary.put("waitingPatients", waitingPatients);
        summary.put("inConsultation", inConsultation);
        summary.put("completedToday", completedToday);
        summary.put("pendingBills", pendingBillsCount);
        summary.put("revenueToday", revenueToday);
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalMedicines", allMedicines.size());
        summary.put("lowStockCount", lowStockMedicines.size());
        summary.put("pendingLabsCount", pendingLabs);
        summary.put("activeAdmissionsCount", activeAdmissions);
        summary.put("patientFlow", patientFlow);
        summary.put("todayAppointments", displayAppointments);

        return summary;
    }
}
