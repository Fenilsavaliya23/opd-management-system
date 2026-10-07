package com.opdModule.backend.service;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.entity.Appointment;
import com.opdModule.backend.exception.ResourceNotFoundException;
import com.opdModule.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointments;
    private final PatientRepository patients;

    public AppointmentService(AppointmentRepository appointments, PatientRepository patients) {
        this.appointments = appointments;
        this.patients = patients;
    }

    public AppointmentResponse book(AppointmentRequest request) {
        var patient = patients.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.patientId()));
        return AppointmentResponse.from(appointments.save(
                new Appointment(patient, request.doctorName().trim(), request.appointmentDateTime())));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> today() {
        var date = LocalDate.now();
        return appointments.findByAppointmentDateTimeGreaterThanEqualAndAppointmentDateTimeLessThanOrderByAppointmentDateTime(
                        date.atStartOfDay(), date.plusDays(1).atStartOfDay())
                .stream().map(AppointmentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Appointment find(Long id) {
        return appointments.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }
}
