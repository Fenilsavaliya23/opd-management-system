package com.opdModule.backend.repository;

import com.opdModule.backend.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByAppointmentPatientIdOrderByCompletedAtDesc(Long patientId);
    boolean existsByAppointmentId(Long appointmentId);
}
