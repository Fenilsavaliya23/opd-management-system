package com.opdModule.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record AppointmentRequest(
        @NotNull Long patientId,
        @NotBlank @Size(max = 120) String doctorName,
        @NotNull @FutureOrPresent LocalDateTime appointmentDateTime
) {
}
