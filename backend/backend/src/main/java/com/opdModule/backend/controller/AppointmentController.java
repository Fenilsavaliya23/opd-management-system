package com.opdModule.backend.controller;

import com.opdModule.backend.dto.*;
import com.opdModule.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointments;

    public AppointmentController(AppointmentService appointments) {
        this.appointments = appointments;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody AppointmentRequest request) {
        return appointments.book(request);
    }

    @GetMapping("/today")
    public List<AppointmentResponse> today() {
        return appointments.today();
    }
}
