package com.opdModule.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 120)
    private String doctorName;

    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    protected Appointment() {
    }

    public Appointment(Patient patient, String doctorName, LocalDateTime appointmentDateTime) {
        this.patient = patient;
        this.doctorName = doctorName;
        this.appointmentDateTime = appointmentDateTime;
    }

    public Long getId() { return id; }
    public Patient getPatient() { return patient; }
    public String getDoctorName() { return doctorName; }
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public AppointmentStatus getStatus() { return status; }
    public void markCompleted() { this.status = AppointmentStatus.COMPLETED; }
}
