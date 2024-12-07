import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { Pierre } from '../model/pierre';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import pour Storage

@Injectable({
  providedIn: 'root',
})
export class PierreService {
  private collectionName = 'pierres';

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage // Service Storage

  ) {}

  getPierres(): Observable<Pierre[]> {
    return this.firestore.collection<Pierre>(this.collectionName).valueChanges();
  }
  getPierreById(id: string): Observable<Pierre | undefined> {
    return this.firestore.collection(this.collectionName).doc<Pierre>(id).valueChanges();
  }

  addPierre(pierre: Pierre) {
    const id = this.firestore.createId();
    pierre.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(pierre);
  }

  uploadImage(file: File): Observable<string> {
    const filePath = `pierres/${Date.now()}_${file.name}`; // Chemin de stockage
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              observer.next(url); // Renvoie l'URL une fois le fichier uploadé
              observer.complete();
            });
          })
        )
        .subscribe();
    });
  }
  updatePierre(id: string, pierre: Partial<Pierre>): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).update(pierre);
  }
  
  deleteImage(imageUrl: string): Promise<void> {
    return this.storage.storage.refFromURL(imageUrl).delete();
  }
  deletePierre(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
