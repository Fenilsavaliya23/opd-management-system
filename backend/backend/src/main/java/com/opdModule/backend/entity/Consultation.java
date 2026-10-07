package com.opdModule.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(nullable = false, length = 100)
    private String vitalOne;

    @Column(nullable = false, length = 100)
    private String vitalTwo;

    @Column(nullable = false, length = 2000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    protected Consultation() {
    }

    public Consultation(Appointment appointment, String vitalOne, String vitalTwo, String notes) {
        this.appointment = appointment;
        this.vitalOne = vitalOne;
        this.vitalTwo = vitalTwo;
        this.notes = notes;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Appointment getAppointment() { return appointment; }
    public String getVitalOne() { return vitalOne; }
    public String getVitalTwo() { return vitalTwo; }
    public String getNotes() { return notes; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
