package com.opdModule.backend.repository;

import com.opdModule.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByNameContainingIgnoreCaseOrPhoneNumberContaining(String name, String phoneNumber);
}
