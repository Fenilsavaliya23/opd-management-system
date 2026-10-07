package com.opdModule.backend.dto;

import com.opdModule.backend.entity.Patient;

public record PatientResponse(Long id, String name, String gender, Integer age, String phoneNumber) {
    public static PatientResponse from(Patient patient) {
        return new PatientResponse(patient.getId(), patient.getName(), patient.getGender(),
                patient.getAge(), patient.getPhoneNumber());
    }
}
