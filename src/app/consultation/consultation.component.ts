import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultation } from '../model/consultation';
import { ConsultationService } from '../services/consultation.service';
import { startOfWeek, addDays, format, parseISO, isSameDay, isSameHour } from 'date-fns';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {
  consultationForm!: FormGroup;
  consultations: Consultation[] = [];
  days: string[] = [];
  hours: string[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      appointmentDate: ['', [Validators.required, this.validateDate]],
      appointmentTime: ['', [Validators.required, this.validateTime]],
      duration: [15, [Validators.required, Validators.min(15), Validators.max(60)]],
      notes: ['']
    });

    this.initializeSchedule();
    this.loadConsultations();
  }

  get formControls() {
    return this.consultationForm.controls;
  }

  initializeSchedule() {
    const today = new Date();
    // const start = startOfWeek(today, { weekStartsOn: 1 }); // Lundi
    for (let i = 0; i < 7; i++) {
      this.days.push(format(addDays(today, i), 'yyyy-MM-dd'));
    }

    for (let i = 8; i <= 17; i++) {
      this.hours.push(`${i}:00`);
    }
  }
  loadConsultations(): void {
    this.consultationService.getConsultations().subscribe({
      next: (data) => {
        this.consultations = data;
        console.log("Consultations chargées : ", this.consultations);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Impossible de charger les rendez-vous : ' + err.message;
      },
      complete: () => (this.loading = false)
    });
  }

  isSlotAvailable(day: string, hour: string, duration: number): boolean {
    const endHour = parseInt(hour.split(':')[0]) + Math.ceil(duration / 60);
    return !this.consultations.some(consultation => {
      const consultationStartHour = parseInt(consultation.appointmentTime.split(':')[0]);
      const consultationEndHour = consultationStartHour + Math.ceil(consultation.duration / 60);
      return (
        consultation.appointmentDate === day &&
        ((consultationStartHour < endHour && consultationStartHour >= parseInt(hour)) ||
          (consultationEndHour > parseInt(hour) && consultationEndHour <= endHour))
      );
    });
  }

  addConsultation(): void {
    if (this.consultationForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs avant de soumettre le formulaire.';
      return;
    }

    const newConsultation: Consultation = this.consultationForm.value;
    this.loading = true;

    if (!this.isSlotAvailable(newConsultation.appointmentDate, newConsultation.appointmentTime, newConsultation.duration)) {
      this.errorMessage = 'Le créneau est déjà réservé. Veuillez choisir une autre heure.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.loading = false;
      return;
    }

    if (!this.validateSlotAvailability(newConsultation.appointmentDate, newConsultation.appointmentTime, newConsultation.duration)) {
      this.errorMessage = 'La durée dépasse les heures d\'ouverture.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.loading = false;
      return;
    }

    this.consultationService.addConsultation(newConsultation).subscribe({
      next: () => {
        this.successMessage = 'Rendez-vous ajouté avec succès !';
        setTimeout(() => (this.successMessage = ''), 5000);
        this.loadConsultations();
        this.consultationForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.errorMessage = 'Le créneau est déjà réservé. Veuillez choisir une autre heure.';
          setTimeout(() => (this.successMessage = ''), 5000);
        } else {
          this.errorMessage = 'Une erreur est survenue : ' + err.message;
          setTimeout(() => (this.successMessage = ''), 5000);
        }
      },
      complete: () => (this.loading = false),
    });
  }

  getConsultation(day: string, hour: string): Consultation | null {
    // console.log("getConsultation : ", this.consultations);

    return this.consultations.find(consultation => {
      // Comparer directement les chaînes de date et d'heure
      return consultation.appointmentDate === day && consultation.appointmentTime === hour;
    }) || null;
  }
  validateDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!control.value) return { required: true }; // Vérifier si la date est vide
    if (selectedDate < today) return { pastDate: true }; // Vérifier si la date est passée

    return null;
  }

  validateTime(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true };

    const hour = parseInt(control.value.split(':')[0], 10);
    if (hour < 8 || hour > 17) return { outsideWorkingHours: true }; // Vérifier si en dehors des heures d'ouverture

    return null;
  }

  validateSlotAvailability(day: string, startHour: string, duration: number): boolean {
    const start = parseInt(startHour.split(':')[0]);
    const end = start + Math.ceil(duration / 60);

    // Heures d'ouverture : 8h - 17h
    return start >= 8 && end <= 17;
  }
}
