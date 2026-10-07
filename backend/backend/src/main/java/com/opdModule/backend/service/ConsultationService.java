package com.opdModule.backend.service;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.entity.Consultation;
import com.opdModule.backend.exception.ConflictException;
import com.opdModule.backend.repository.ConsultationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ConsultationService {
    private final ConsultationRepository consultations;
    private final AppointmentService appointments;

    public ConsultationService(ConsultationRepository consultations, AppointmentService appointments) {
        this.consultations = consultations;
        this.appointments = appointments;
    }

    @Transactional
    public ConsultationResponse complete(Long appointmentId, ConsultationRequest request) {
        var appointment = appointments.find(appointmentId);
        if (consultations.existsByAppointmentId(appointmentId)) {
            throw new ConflictException("Consultation already exists for appointment: " + appointmentId);
        }
        appointment.markCompleted();
        return ConsultationResponse.from(consultations.save(
                new Consultation(appointment, request.vitalOne().trim(), request.vitalTwo().trim(),
                        request.notes().trim())));
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> forPatient(Long patientId) {
        return consultations.findByAppointmentPatientIdOrderByCompletedAtDesc(patientId)
                .stream().map(ConsultationResponse::from).toList();
    }
}
