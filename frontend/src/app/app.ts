import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type View = 'patients' | 'appointments' | 'consultations';
interface Patient { id: number; name: string; gender: string; age: number; phone: string; }
interface Appointment { id: number; patientId: number; patientName: string; doctor: string; date: string; time: string; status: 'Scheduled' | 'Completed'; }
interface Consultation { id: number; appointmentId: number; patientName: string; doctor: string; date: string; pulse: string; temperature: string; notes: string; }

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly activeView = signal<View>('patients');
  protected readonly patientSearch = signal('');
  protected readonly patients = signal<Patient[]>([
    { id: 1, name: 'Aarav Shah', gender: 'Male', age: 34, phone: '9876543210' },
    { id: 2, name: 'Meera Patel', gender: 'Female', age: 28, phone: '9123456780' },
  ]);
  protected readonly appointments = signal<Appointment[]>([
    { id: 1, patientId: 1, patientName: 'Aarav Shah', doctor: 'Dr. Priya Mehta', date: this.today(), time: '10:30', status: 'Scheduled' },
    { id: 2, patientId: 2, patientName: 'Meera Patel', doctor: 'Dr. Karan Shah', date: this.today(), time: '11:15', status: 'Scheduled' },
  ]);
  protected readonly consultations = signal<Consultation[]>([]);
  protected readonly filteredPatients = computed(() => {
    const search = this.patientSearch().trim().toLowerCase();
    return this.patients().filter((patient) => !search || patient.name.toLowerCase().includes(search) || patient.phone.includes(search));
  });

  protected patientForm = { name: '', gender: '', age: null as number | null, phone: '' };
  protected appointmentForm = { patientId: null as number | null, doctor: '', date: this.today(), time: '' };
  protected consultationForm = { appointmentId: null as number | null, pulse: '', temperature: '', notes: '' };

  protected setView(view: View): void { this.activeView.set(view); }

  protected addPatient(): void {
    if (!this.patientForm.name || !this.patientForm.gender || !this.patientForm.age || !this.patientForm.phone) return;
    const patient: Patient = { id: Date.now(), ...this.patientForm, age: this.patientForm.age };
    this.patients.update((patients) => [patient, ...patients]);
    this.patientForm = { name: '', gender: '', age: null, phone: '' };
  }

  protected bookAppointment(): void {
    const patient = this.patients().find((item) => item.id === this.appointmentForm.patientId);
    if (!patient || !this.appointmentForm.doctor || !this.appointmentForm.date || !this.appointmentForm.time) return;
    const appointment: Appointment = { id: Date.now(), patientId: patient.id, patientName: patient.name, doctor: this.appointmentForm.doctor, date: this.appointmentForm.date, time: this.appointmentForm.time, status: 'Scheduled' };
    this.appointments.update((appointments) => [appointment, ...appointments]);
    this.appointmentForm = { patientId: null, doctor: '', date: this.today(), time: '' };
  }

  protected completeConsultation(): void {
    const appointment = this.appointments().find((item) => item.id === this.consultationForm.appointmentId);
    if (!appointment || !this.consultationForm.pulse || !this.consultationForm.temperature || !this.consultationForm.notes) return;
    this.consultations.update((consultations) => [{ id: Date.now(), appointmentId: appointment.id, patientName: appointment.patientName, doctor: appointment.doctor, date: appointment.date, pulse: this.consultationForm.pulse, temperature: this.consultationForm.temperature, notes: this.consultationForm.notes }, ...consultations]);
    this.appointments.update((appointments) => appointments.map((item) => item.id === appointment.id ? { ...item, status: 'Completed' } : item));
    this.consultationForm = { appointmentId: null, pulse: '', temperature: '', notes: '' };
  }

  protected todayAppointments(): Appointment[] { return this.appointments().filter((appointment) => appointment.date === this.today()); }
  private today(): string { return new Date().toISOString().slice(0, 10); }
}
