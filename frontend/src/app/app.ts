import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Appointment as ApiAppointment,
  Consultation as ApiConsultation,
  OpdApiService,
} from './services/opd-api.service';

type View = 'patients' | 'appointments' | 'consultations';
interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
}
interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed';
}
interface Consultation {
  id: number;
  appointmentId: number;
  patientName: string;
  doctor: string;
  date: string;
  pulse: string;
  temperature: string;
  notes: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly opdApi = inject(OpdApiService);
  protected readonly activeView = signal<View>('patients');
  protected readonly patientSearch = signal('');
  protected readonly patients = signal<Patient[]>([]);
  protected readonly patientError = signal('');
  protected readonly patientsLoading = signal(false);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly appointmentError = signal('');
  protected readonly appointmentsLoading = signal(false);
  protected readonly consultations = signal<Consultation[]>([]);
  protected readonly consultationError = signal('');
  protected readonly consultationsLoading = signal(false);
  protected readonly filteredPatients = computed(() => {
    const search = this.patientSearch().trim().toLowerCase();
    return this.patients().filter(
      (patient) =>
        !search || patient.name.toLowerCase().includes(search) || patient.phone.includes(search),
    );
  });

  protected patientForm = { name: '', gender: '', age: null as number | null, phone: '' };
  protected appointmentForm = {
    patientId: null as number | null,
    doctor: '',
    date: this.today(),
    time: '',
  };
  protected consultationForm = {
    appointmentId: null as number | null,
    pulse: '',
    temperature: '',
    notes: '',
  };

  constructor() {
    this.loadPatients();
    this.loadAppointments();
  }

  protected setView(view: View): void {
    this.activeView.set(view);
  }

  protected addPatient(): void {
    if (
      !this.patientForm.name ||
      !this.patientForm.gender ||
      this.patientForm.age === null ||
      !this.patientForm.phone
    )
      return;

    this.patientError.set('');
    this.patientsLoading.set(true);
    this.opdApi
      .createPatient({
        name: this.patientForm.name,
        gender: this.patientForm.gender,
        age: this.patientForm.age,
        phoneNumber: this.patientForm.phone,
      })
      .subscribe({
        next: (patient) => {
          this.patients.update((patients) => [this.toPatient(patient), ...patients]);
          this.patientForm = { name: '', gender: '', age: null, phone: '' };
          this.patientsLoading.set(false);
        },
        error: () => {
          this.patientError.set('Unable to register patient. Please try again.');
          this.patientsLoading.set(false);
        },
      });
  }

  protected bookAppointment(): void {
    if (
      this.appointmentForm.patientId === null ||
      !this.appointmentForm.doctor ||
      !this.appointmentForm.date ||
      !this.appointmentForm.time
    )
      return;

    this.appointmentError.set('');
    this.appointmentsLoading.set(true);
    this.opdApi
      .createAppointment({
        patientId: this.appointmentForm.patientId,
        doctorName: this.appointmentForm.doctor,
        appointmentDateTime: `${this.appointmentForm.date}T${this.appointmentForm.time}:00`,
      })
      .subscribe({
        next: (appointment) => {
          this.appointments.update((appointments) => [
            this.toAppointment(appointment),
            ...appointments,
          ]);
          this.appointmentForm = { patientId: null, doctor: '', date: this.today(), time: '' };
          this.appointmentsLoading.set(false);
        },
        error: () => {
          this.appointmentError.set('Unable to book appointment. Please try again.');
          this.appointmentsLoading.set(false);
        },
      });
  }

  protected completeConsultation(): void {
    const appointment = this.appointments().find(
      (item) => item.id === this.consultationForm.appointmentId,
    );
    if (
      !appointment ||
      !this.consultationForm.pulse ||
      !this.consultationForm.temperature ||
      !this.consultationForm.notes
    )
      return;

    this.consultationError.set('');
    this.consultationsLoading.set(true);
    this.opdApi
      .completeConsultation(appointment.id, {
        vitalOne: this.consultationForm.pulse,
        vitalTwo: this.consultationForm.temperature,
        notes: this.consultationForm.notes,
      })
      .subscribe({
        next: (consultation) => {
          this.consultations.update((consultations) => [
            this.toConsultation(consultation),
            ...consultations,
          ]);
          this.appointments.update((appointments) =>
            appointments.map((item) =>
              item.id === appointment.id ? { ...item, status: 'Completed' } : item,
            ),
          );
          this.consultationForm = { appointmentId: null, pulse: '', temperature: '', notes: '' };
          this.consultationsLoading.set(false);
        },
        error: () => {
          this.consultationError.set('Unable to complete consultation. Please try again.');
          this.consultationsLoading.set(false);
        },
      });
  }

  protected todayAppointments(): Appointment[] {
    return this.appointments().filter((appointment) => appointment.date === this.today());
  }
  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private loadPatients(): void {
    this.patientsLoading.set(true);
    this.opdApi.getPatients().subscribe({
      next: (patients) => {
        this.patients.set(patients.map((patient) => this.toPatient(patient)));
        this.patientError.set('');
        this.patientsLoading.set(false);
      },
      error: () => {
        this.patientError.set('Unable to load patients. Please try again.');
        this.patientsLoading.set(false);
      },
    });
  }

  private loadAppointments(): void {
    this.appointmentsLoading.set(true);
    this.opdApi.getTodayAppointments().subscribe({
      next: (appointments) => {
        this.appointments.set(appointments.map((appointment) => this.toAppointment(appointment)));
        this.appointmentError.set('');
        this.appointmentsLoading.set(false);
      },
      error: () => {
        this.appointmentError.set('Unable to load appointments. Please try again.');
        this.appointmentsLoading.set(false);
      },
    });
  }

  private toPatient(patient: {
    id: number;
    name: string;
    gender: string;
    age: number;
    phoneNumber: string;
  }): Patient {
    return {
      id: patient.id,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      phone: patient.phoneNumber,
    };
  }

  private toAppointment(appointment: ApiAppointment): Appointment {
    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctor: appointment.doctorName,
      date: appointment.appointmentDateTime.slice(0, 10),
      time: appointment.appointmentDateTime.slice(11, 16),
      status: appointment.status.toUpperCase() === 'COMPLETED' ? 'Completed' : 'Scheduled',
    };
  }

  private toConsultation(consultation: ApiConsultation): Consultation {
    return {
      id: consultation.id,
      appointmentId: consultation.appointmentId,
      patientName: consultation.patientName,
      doctor: consultation.doctorName,
      date: consultation.completedAt.slice(0, 10),
      pulse: consultation.vitalOne,
      temperature: consultation.vitalTwo,
      notes: consultation.notes,
    };
  }
}
