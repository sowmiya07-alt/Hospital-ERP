package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Department;
import com.hospital.hospitalerp.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Department existing = departmentRepository.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setName(department.getName());
        existing.setCode(department.getCode());
        existing.setDescription(department.getDescription());
        return departmentRepository.save(existing);
    }

    public String deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            return "Department Not Found";
        }
        departmentRepository.deleteById(id);
        return "Department Deleted Successfully";
    }
}
