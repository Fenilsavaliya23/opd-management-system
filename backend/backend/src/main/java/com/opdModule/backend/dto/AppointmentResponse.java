package com.opdModule.backend.dto;

import com.opdModule.backend.entity.Appointment;
import java.time.LocalDateTime;

public record AppointmentResponse(Long id, Long patientId, String patientName, String doctorName,
                                  LocalDateTime appointmentDateTime, String status) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(appointment.getId(), appointment.getPatient().getId(),
                appointment.getPatient().getName(), appointment.getDoctorName(),
                appointment.getAppointmentDateTime(), appointment.getStatus().name());
    }
}
