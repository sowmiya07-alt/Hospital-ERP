package com.hospital.hospitalerp.config;

import com.hospital.hospitalerp.entity.*;
import com.hospital.hospitalerp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {

        // 0. Seed Departments if empty
        Department card = null, gen = null, peds = null;
        if (departmentRepository.count() == 0) {
            card = departmentRepository.save(new Department(null, "Cardiology", "CARD", "Heart and Cardiovascular System"));
            gen = departmentRepository.save(new Department(null, "General Medicine", "GEN", "General Adult Healthcare and Prevention"));
            peds = departmentRepository.save(new Department(null, "Pediatrics", "PEDS", "Infant, Child, and Adolescent Care"));
            departmentRepository.save(new Department(null, "Orthopedics", "ORTHO", "Musculoskeletal System and Bones"));
            departmentRepository.save(new Department(null, "Neurology", "NEURO", "Brain and Nervous System Disorders"));
            departmentRepository.save(new Department(null, "Pharmacy", "PHARM", "Pharmaceuticals and Dispensing"));
            System.out.println(">>> Seeded default departments");
        } else {
            card = departmentRepository.findByName("Cardiology").orElse(null);
            gen = departmentRepository.findByName("General Medicine").orElse(null);
            peds = departmentRepository.findByName("Pediatrics").orElse(null);
        }

        // 1. Seed Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Seeded default admin user (admin / admin123)");
        }

        // 2. Seed Doctors if empty
        if (doctorRepository.count() == 0) {
            Doctor doc1 = new Doctor(null, "Dr. Sarah Jenkins", "Cardiology", "MD, FACC", "+1-555-0192", "s.jenkins@hospital.org", 12, 100.0, card, "ACTIVE");
            Doctor doc2 = new Doctor(null, "Dr. Rajesh Kumar", "General Medicine", "MBBS, MD", "+1-555-0144", "r.kumar@hospital.org", 8, 60.0, gen, "ACTIVE");
            Doctor doc3 = new Doctor(null, "Dr. Elena Rostova", "Pediatrics", "MD (Pediatrics)", "+1-555-0188", "e.rostova@hospital.org", 15, 80.0, peds, "ACTIVE");

            doc1 = doctorRepository.save(doc1);
            doc2 = doctorRepository.save(doc2);
            doc3 = doctorRepository.save(doc3);

            createDoctorUser("sarah", "doctor123", doc1);
            createDoctorUser("rajesh", "doctor123", doc2);
            createDoctorUser("elena", "doctor123", doc3);

            System.out.println(">>> Seeded default doctors and logins");
        } else {
            // Ensure usernames are updated if seeded previously
            doctorRepository.findAll().forEach(doc -> {
                if ("Dr. Sarah Jenkins".equalsIgnoreCase(doc.getName())) createDoctorUser("sarah", "doctor123", doc);
                if ("Dr. Rajesh Kumar".equalsIgnoreCase(doc.getName())) createDoctorUser("rajesh", "doctor123", doc);
                if ("Dr. Elena Rostova".equalsIgnoreCase(doc.getName())) createDoctorUser("elena", "doctor123", doc);
            });
        }

        // 3. Seed Patients if empty
        if (patientRepository.count() == 0) {
            Patient p1 = new Patient(null, "John Doe", 34, "Male", "+1-555-0101", "123 Maple Street");
            Patient p2 = new Patient(null, "Emily Watson", 28, "Female", "+1-555-0102", "456 Oak Avenue");
            Patient p3 = new Patient(null, "Michael Smith", 52, "Male", "+1-555-0103", "789 Pine Road");

            p1 = patientRepository.save(p1);
            p2 = patientRepository.save(p2);
            p3 = patientRepository.save(p3);

            createPatientUser("john", "patient123", p1);
            createPatientUser("emily", "patient123", p2);
            createPatientUser("michael", "patient123", p3);

            System.out.println(">>> Seeded default patients and logins");
        } else {
            // Ensure usernames are updated if seeded previously
            patientRepository.findAll().forEach(p -> {
                if ("John Doe".equalsIgnoreCase(p.getName())) createPatientUser("john", "patient123", p);
                if ("Emily Watson".equalsIgnoreCase(p.getName())) createPatientUser("emily", "patient123", p);
                if ("Michael Smith".equalsIgnoreCase(p.getName())) createPatientUser("michael", "patient123", p);
            });
        }

        // 4. Seed Medicines if empty
        if (medicineRepository.count() == 0) {
            medicineRepository.save(new Medicine(null, "Paracetamol 500mg", "500mg", "PharmaCare", 250));
            medicineRepository.save(new Medicine(null, "Amoxicillin 250mg", "250mg", "BioHealth", 120));
            medicineRepository.save(new Medicine(null, "Ibuprofen 400mg", "400mg", "MediCorp", 180));
            medicineRepository.save(new Medicine(null, "Atorvastatin 10mg", "10mg", "CardioMed", 90));
            medicineRepository.save(new Medicine(null, "Metformin 500mg", "500mg", "EndoLabs", 150));
            medicineRepository.save(new Medicine(null, "Cetirizine 10mg", "10mg", "AllergyFree", 8));
            System.out.println(">>> Seeded default medicines");
        }
    }

    private void createDoctorUser(String username, String rawPassword, Doctor doctor) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole("DOCTOR");
            user.setDoctor(doctor);
            userRepository.save(user);
        }
    }

    private void createPatientUser(String username, String rawPassword, Patient patient) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole("PATIENT");
            user.setPatient(patient);
            userRepository.save(user);
        }
    }
}
