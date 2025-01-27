import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { Avis } from '../model/avis';
import { AngularFireStorage } from '@angular/fire/compat/storage';



@Injectable({
  providedIn: 'root',
})
export class AvisService {
  private collectionName = 'avis';

  constructor(private firestore: AngularFirestore,private storage: AngularFireStorage) {}

  // Récupérer tous les avis
  getAvis(): Observable<Avis[]> {
    return this.firestore.collection<Avis>(this.collectionName).valueChanges({ idField: 'id' });
  }
  generateId(): string {
    return this.firestore.createId();
  }
  // Ajouter un nouvel avis
  addAvis(avis: Avis): Promise<void> {
    const id = this.generateId();
    avis.id = id;
    avis.createdAt = new Date();
    avis.updatedAt = new Date();
    return this.firestore.collection(this.collectionName).doc(id).set(avis);
  }

  // Mettre à jour un avis existant
  updateAvis(id: string, avis: Partial<Avis>): Promise<void> {
    avis.updatedAt = new Date();
    return this.firestore.collection(this.collectionName).doc(id).update(avis);
  }


  // Supprimer un avis
  deleteAvis(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
  uploadFile(file: File): Observable<string> {
    const filePath = `avis/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);  
            observer.complete();
          });
        })
      ).subscribe();
    });
  }
  deleteFile(fileUrl: string): Promise<void> {
    return this.storage.storage.refFromURL(fileUrl).delete();
  }
}
