import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultation } from 'src/app/model/consultation';
import { ConsultationService } from 'src/app/services/consultation.service';
import { addDays, format, isSameDay, isSameHour, startOfWeek } from 'date-fns';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-consultation-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consultation-management.component.html',
  styleUrls: ['./consultation-management.component.css'],
})
export class ConsultationManagementComponent implements OnInit {
  consultationForm!: FormGroup;
  consultations: Consultation[] = [];
  days: string[] = [];
  hours: string[] = [];
  editingConsultationId: string | null = null;

  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  filteredConsultations: Consultation[] = [];
  searchName: string = '';
  searchDate: string = '';

  // blockedTimeSlots: { day: string, startHour: string, endHour: string }[] = [
  //   { day: '2025-01-18', startHour: '12:00', endHour: '13:00' },
  // ];
  // newBlockedSlot = { day: '', startHour: '', endHour: '' };

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
  ngOnChanges(): void {
    this.filterConsultations(); // Met à jour les consultations filtrées lors du changement
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
        this.filteredConsultations = [...data];
        console.log("Consultations chargées : ", this.consultations);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Impossible de charger les rendez-vous : ' + err.message;
      },
      complete: () => (this.loading = false)
    });
  }

  filterConsultations(): void {
    const searchNameLower = this.searchName.toLowerCase().trim();
    const searchDateValue = this.searchDate.trim();

    this.filteredConsultations = this.consultations.filter((consultation) => {
      const matchesName = searchNameLower
        ? consultation.clientName.toLowerCase().includes(searchNameLower)
        : true;
      const matchesDate = searchDateValue
        ? consultation.appointmentDate === searchDateValue
        : true;
      return matchesName && matchesDate;
    });
  }




  isSlotAvailable(day: string, hour: string, duration: number, currentId: string): boolean {
    const endHour = parseInt(hour.split(':')[0]) + Math.ceil(duration / 60);

    // if (this.isBlockedSlot(day, hour)) {
    //   return false; 
    // }

    return !this.consultations.some(consultation => {
      if (currentId && consultation.id === currentId) {
        return false; // Ignorer la consultation courante
      }
      const consultationStartHour = parseInt(consultation.appointmentTime.split(':')[0]);
      const consultationEndHour = consultationStartHour + Math.ceil(consultation.duration / 60);
      return (
        consultation.appointmentDate === day &&
        ((consultationStartHour < endHour && consultationStartHour >= parseInt(hour)) ||
          (consultationEndHour > parseInt(hour) && consultationEndHour <= endHour))
      );
    });
  }
  addOrUpdateConsultation(): void {
    if (this.consultationForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs avant de soumettre le formulaire.';
      return;
    }

    const consultationData: Consultation = {
      ...this.consultationForm.value,
      id: this.editingConsultationId || '', // Utiliser l'ID existant ou un ID vide pour un ajout
    };

    const day = consultationData.appointmentDate;
    const hour = consultationData.appointmentTime;
    const duration = consultationData.duration;

    if (!this.isSlotAvailable(day, hour, duration, this.editingConsultationId ? this.editingConsultationId : '')) {
      this.errorMessage = 'Le créneau est déjà réservé. Veuillez choisir une autre heure.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    if (!this.validateSlotAvailability(day, hour, duration)) {
      this.errorMessage = 'Le créneau dépasse les heures d\'ouverture.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    if (this.editingConsultationId) {
      // Mode édition
      this.consultationService
        .updateConsultation(this.editingConsultationId, consultationData)
        .then(() => {
          this.successMessage = 'Rendez-vous mis à jour avec succès.';
          setTimeout(() => this.successMessage = '', 5000);
          this.editingConsultationId = null;
          this.consultationForm.reset();
          this.loadConsultations();
        })
        .catch(() => {
          this.errorMessage = 'Erreur lors de la mise à jour du rendez-vous.';
          setTimeout(() => this.errorMessage = '', 5000);
        });
    } else {
      // Mode ajout
      this.consultationService.addConsultation(consultationData).subscribe({
        next: () => {
          this.successMessage = 'Rendez-vous ajouté avec succès.';
          setTimeout(() => this.successMessage = '', 5000);
          this.consultationForm.reset();
          this.loadConsultations();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l\'ajout du rendez-vous.';
          setTimeout(() => this.errorMessage = '', 5000);
        },
      });
    }
  }

  getConsultation(day: string, hour: string): Consultation | null {
    return this.consultations.find(consultation => {
      if (consultation.appointmentDate !== day) return false;

      const [hourStart, minuteStart] = hour.split(':').map(Number);
      const [appointmentHour, appointmentMinute] = consultation.appointmentTime.split(':').map(Number);

      const appointmentEndHour = appointmentHour + Math.floor(consultation.duration / 60);
      const appointmentEndMinute = (appointmentMinute + (consultation.duration % 60)) % 60;

      // Vérifier si l'heure/durée chevauche le créneau horaire
      const startInSlot =
        (appointmentHour < hourStart ||
          (appointmentHour === hourStart && appointmentMinute <= minuteStart));
      const endInSlot =
        (appointmentEndHour > hourStart ||
          (appointmentEndHour === hourStart && appointmentEndMinute > minuteStart));

      return startInSlot && endInSlot;
    }) || null;
  }


  editConsultation(consultation: Consultation): void {
    this.editingConsultationId = consultation.id;
    this.consultationForm.patchValue({
      clientName: consultation.clientName,
      email: consultation.email,
      phone: consultation.phone,
      appointmentDate: consultation.appointmentDate,
      appointmentTime: consultation.appointmentTime,
      duration: consultation.duration,
      notes: consultation.notes,
    });
  }
  cancelEdit(): void {
    this.editingConsultationId = null;
    this.consultationForm.reset();
  }


  deleteConsultation(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      this.consultationService.deleteConsultation(id).then(() => {
        this.successMessage = 'Consultation supprimée avec succès !';
        setTimeout(() => this.successMessage = '', 5000);
        this.loadConsultations(); // Recharger la liste des consultations
      }).catch(error => {
        this.errorMessage = 'Erreur lors de la suppression : ' + error.message;
        setTimeout(() => this.errorMessage = '', 5000);
      });
    }
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

  // getBlockedSlot(day: string, hour: string): boolean {
  //   return this.blockedTimeSlots.some(slot =>
  //     slot.day === day && hour >= slot.startHour && hour < slot.endHour
  //   );
  // }
  // isBlockedSlot(day: string, hour: string): boolean {
  //   return this.blockedTimeSlots.some(slot => 
  //     slot.day === day && 
  //     hour >= slot.startHour && 
  //     hour < slot.endHour
  //   );
  // }
  // addBlockedSlot() {
  //   if (this.newBlockedSlot.day && this.newBlockedSlot.startHour && this.newBlockedSlot.endHour) {
  //     this.blockedTimeSlots.push(this.newBlockedSlot);
  //     this.newBlockedSlot = { day: '', startHour: '', endHour: '' }; // Reset du formulaire
  //   }
  // }
}
