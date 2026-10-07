package com.opdModule.backend.dto;

import jakarta.validation.constraints.*;

public record ConsultationRequest(
        @NotBlank @Size(max = 100) String vitalOne,
        @NotBlank @Size(max = 100) String vitalTwo,
        @NotBlank @Size(max = 2000) String notes
) {
}
