export interface Consultation {
    id: string;
    clientName: string;
    email?: string;
    phone: string;
    appointmentDate: string;
    appointmentTime: string; // Format: "HH:mm"
    duration: number;
    notes?: string;
    status: 'en attente' | 'confirmé' | 'annulé';
  }
  