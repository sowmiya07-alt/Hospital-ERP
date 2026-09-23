package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Medicine;
import com.hospital.hospitalerp.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id,
                                   @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine);
    }

    @GetMapping("/low-stock")
    public List<Medicine> getLowStockMedicines() {
        return medicineService.getLowStockMedicines();
    }

    @PostMapping("/{id}/dispense")
    public Medicine dispenseMedicine(@PathVariable Long id, @RequestParam Integer quantity) {
        return medicineService.dispenseMedicine(id, quantity);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        return medicineService.deleteMedicine(id);
    }
}