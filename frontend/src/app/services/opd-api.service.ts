import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  phoneNumber: string;
}

export interface PatientRequest {
  name: string;
  gender: string;
  age: number;
  phoneNumber: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  appointmentDateTime: string;
  status: string;
}

export interface AppointmentRequest {
  patientId: number;
  doctorName: string;
  appointmentDateTime: string;
}

export interface Consultation {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  vitalOne: string;
  vitalTwo: string;
  notes: string;
  completedAt: string;
}

export interface ConsultationRequest {
  vitalOne: string;
  vitalTwo: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class OpdApiService {
  private readonly http = inject(HttpClient);

  getPatients(query?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (query?.trim()) {
      params = params.set('query', query.trim());
    }
    return this.http.get<Patient[]>(`${API_BASE_URL}/patients`, { params });
  }

  createPatient(request: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(`${API_BASE_URL}/patients`, request);
  }

  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_BASE_URL}/appointments/today`);
  }

  createAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${API_BASE_URL}/appointments`, request);
  }

  completeConsultation(
    appointmentId: number,
    request: ConsultationRequest,
  ): Observable<Consultation> {
    return this.http.post<Consultation>(
      `${API_BASE_URL}/appointments/${appointmentId}/consultation`,
      request,
    );
  }

  getPatientConsultations(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${API_BASE_URL}/patients/${patientId}/consultations`);
  }
}
