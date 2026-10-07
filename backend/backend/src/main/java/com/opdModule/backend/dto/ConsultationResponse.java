package com.opdModule.backend.dto;

import com.opdModule.backend.entity.Consultation;
import java.time.LocalDateTime;

public record ConsultationResponse(Long id, Long appointmentId, Long patientId, String patientName,
                                   String doctorName, String vitalOne, String vitalTwo, String notes,
                                   LocalDateTime completedAt) {
    public static ConsultationResponse from(Consultation consultation) {
        var appointment = consultation.getAppointment();
        return new ConsultationResponse(consultation.getId(), appointment.getId(),
                appointment.getPatient().getId(), appointment.getPatient().getName(),
                appointment.getDoctorName(), consultation.getVitalOne(), consultation.getVitalTwo(),
                consultation.getNotes(), consultation.getCompletedAt());
    }
}
