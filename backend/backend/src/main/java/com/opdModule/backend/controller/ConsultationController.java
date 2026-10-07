package com.opdModule.backend.controller;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ConsultationController {
    private final ConsultationService consultations;

    public ConsultationController(ConsultationService consultations) {
        this.consultations = consultations;
    }

    @PostMapping("/appointments/{appointmentId}/consultation")
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultationResponse complete(@PathVariable Long appointmentId,
                                         @Valid @RequestBody ConsultationRequest request) {
        return consultations.complete(appointmentId, request);
    }

    @GetMapping("/patients/{patientId}/consultations")
    public List<ConsultationResponse> forPatient(@PathVariable Long patientId) {
        return consultations.forPatient(patientId);
    }
}
