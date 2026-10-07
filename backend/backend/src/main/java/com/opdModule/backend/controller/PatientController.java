package com.opdModule.backend.controller;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patients;

    public PatientController(PatientService patients) {
        this.patients = patients;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse create(@Valid @RequestBody PatientRequest request) {
        return patients.create(request);
    }

    @GetMapping
    public List<PatientResponse> search(@RequestParam(required = false) String query) {
        return patients.search(query);
    }
}
