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
            existing.setGenericName(medicine.getGenericName());
            existing.setDosage(medicine.getDosage());
            existing.setCategory(medicine.getCategory());
            existing.setManufacturer(medicine.getManufacturer());
            existing.setStock(medicine.getStock());
            existing.setUnitPrice(medicine.getUnitPrice());
            existing.setBatchNumber(medicine.getBatchNumber());
            existing.setExpiryDate(medicine.getExpiryDate());
            if (medicine.getReorderLevel() != null) {
                existing.setReorderLevel(medicine.getReorderLevel());
            }
            if (medicine.getStatus() != null) {
                existing.setStatus(medicine.getStatus());
            }

            return medicineRepository.save(existing);
        }

        return null;
    }

    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines();
    }

    public Medicine dispenseMedicine(Long id, Integer quantity) {
        Medicine medicine = medicineRepository.findById(id).orElse(null);
        if (medicine == null) {
            throw new RuntimeException("Medicine not found with ID: " + id);
        }
        if (medicine.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available for " + medicine.getMedicineName() + ". Current stock: " + medicine.getStock());
        }
        medicine.setStock(medicine.getStock() - quantity);
        return medicineRepository.save(medicine);
    }

    public String deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
        return "Medicine Deleted Successfully";
    }
}