package com.opdModule.backend.dto;

import jakarta.validation.constraints.*;

public record PatientRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 20) String gender,
        @NotNull @Min(0) @Max(150) Integer age,
        @NotBlank @Size(max = 30) String phoneNumber
) {
}
