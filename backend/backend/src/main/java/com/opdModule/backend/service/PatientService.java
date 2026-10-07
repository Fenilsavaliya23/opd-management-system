package com.opdModule.backend.service;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.entity.Patient;
import com.opdModule.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patients;

    public PatientService(PatientRepository patients) {
        this.patients = patients;
    }

    public PatientResponse create(PatientRequest request) {
        return PatientResponse.from(patients.save(new Patient(request.name().trim(), request.gender().trim(),
                request.age(), request.phoneNumber().trim())));
    }

    public List<PatientResponse> search(String query) {
        var result = query == null || query.isBlank()
                ? patients.findAll()
                : patients.findByNameContainingIgnoreCaseOrPhoneNumberContaining(query.trim(), query.trim());
        return result.stream().map(PatientResponse::from).toList();
    }
}
