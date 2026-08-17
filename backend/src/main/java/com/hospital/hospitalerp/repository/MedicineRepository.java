package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE m.stock <= m.reorderLevel OR m.stock <= 15")
    List<Medicine> findLowStockMedicines();

    List<Medicine> findByCategory(String category);
}