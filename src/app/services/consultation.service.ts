import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consultation } from '../model/consultation';


@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private collectionName = 'consultations';

  constructor(private firestore: AngularFirestore) { }

  // Ajouter une nouvelle consultation
  addConsultation(consultation: Consultation): Observable<void> {
    const id = this.firestore.createId(); // Génère un ID unique
    return from(
      this.firestore.collection(this.collectionName).doc(id).set({
        ...consultation,
        id, // Ajoute l'ID généré
      })
    ).pipe(
      // Transformer le résultat pour correspondre à Observable<void>
      map(() => void 0)
    );
  }

  // Récupérer toutes les consultations
  getConsultations(): Observable<Consultation[]> {
    return this.firestore
      .collection<Consultation>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Consultation;
            const id = a.payload.doc.id;
    // console.log("ConsultationService: ",data)

            return { ...data, id };
          })
        )
      );
  }

  // Mettre à jour une consultation
  updateConsultation(id: string, updatedConsultation: Partial<Consultation>): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).update(updatedConsultation);
  }

  // Supprimer une consultation
  deleteConsultation(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  // Récupérer une consultation spécifique par ID
  getConsultationById(id: string): Observable<Consultation | undefined> {
    return this.firestore
      .collection(this.collectionName)
      .doc<Consultation>(id)
      .valueChanges()
      .pipe(
        map(consultation => {
          if (consultation) {
            return { ...consultation, id } as Consultation;
          }
          return undefined;
        })
      );
  }
}
