package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Medicine;
import com.hospital.hospitalerp.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id).orElse(null);
    }

    public Medicine updateMedicine(Long id, Medicine medicine) {

        Medicine existing = medicineRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setMedicineName(medicine.getMedicineName());
            existing.setDosage(medicine.getDosage());
            existing.setManufacturer(medicine.getManufacturer());
            existing.setStock(medicine.getStock());

            return medicineRepository.save(existing);
        }

        return null;
    }

    public String deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
        return "Medicine Deleted Successfully";
    }
}