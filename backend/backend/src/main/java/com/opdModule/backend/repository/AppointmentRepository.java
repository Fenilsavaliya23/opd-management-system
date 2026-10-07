package com.opdModule.backend.repository;

import com.opdModule.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByAppointmentDateTimeGreaterThanEqualAndAppointmentDateTimeLessThanOrderByAppointmentDateTime(
            LocalDateTime start, LocalDateTime end);
}
