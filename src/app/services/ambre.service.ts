import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ambre } from '../model/ambre';
import { catchError, finalize, Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import du service Storage

@Injectable({
  providedIn: 'root',
})
export class AmbreService {
  private ambreCollection = this.firestore.collection<Ambre>('/Ambre');

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  addAmbre(amb: Ambre) {
    amb.id = this.firestore.createId();
    return this.firestore.collection('/Ambre').add(amb);
  }
  getAmbreById(ambreId: string): Observable<Ambre | null | undefined> {
    return this.ambreCollection.doc(ambreId).valueChanges().pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération de l’ambre :', error);
        return of(null); // Retourne `null` en cas d'erreur
      })
    );;
  }
  getAllAmbre() {
    return this.firestore.collection('/Ambre').snapshotChanges();
  }

  deleteAmbre(amb: Ambre) {
    return this.firestore.doc('/Ambre/' + amb.id).delete();
  }

  // Méthode pour télécharger des images vers Firebase Storage
  uploadImage(file: File, ambreId: string): Observable<string> {
    const filePath = `ambres/${ambreId}/${file.name}`; // Chemin de stockage
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              observer.next(url); // Renvoie l'URL après téléchargement
              observer.complete();
            });
          })
        )
        .subscribe();
    });
  }
  updateAmbre(id: string, updatedData: Partial<Ambre>) {
    return this.firestore.collection('/Ambre').doc(id).update(updatedData);
  }

  // updateAmbre(ambre: Ambre): Promise<void> {
  //   const documentId = ambre.id; // Get the document ID from the object
  //   return this.firestore.collection('/Ambre').doc(documentId).update({
  //     name: ambre.name,
  //     price: ambre.price,
  //     description: ambre.description,
  //     imageUrl: ambre.imageUrl,
  //     stock: ambre.stock,
  //     createdAt: ambre.createdAt,
  //     updatedAt: new Date(), // Update the timestamp
  //     discount: ambre.discount,
  //   });
  // }
}
