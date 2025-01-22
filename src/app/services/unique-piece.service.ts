// unique-piece.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UniquePiece } from '../model/unique-piece';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class UniquePieceService {
  private uniquePiecesCollection: AngularFirestoreCollection<UniquePiece>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    this.uniquePiecesCollection = this.firestore.collection<UniquePiece>('uniquePieces');
  }

  generateId(): string {
    return this.firestore.createId();
  }

  getAllUniquePieces(): Observable<UniquePiece[]> {
    return this.uniquePiecesCollection.valueChanges({ idField: 'id' });
  }

  getUniquePieceById(id: string): Observable<UniquePiece | undefined> {
    return this.uniquePiecesCollection.doc<UniquePiece>(id).valueChanges();
  }

  addUniquePiece(piece: UniquePiece): Promise<void> {
    const id = this.firestore.createId();
    return this.uniquePiecesCollection.doc(id).set({ ...piece, id });
  }

  updateUniquePiece(id: string, piece: Partial<UniquePiece>): Promise<void> {
    return this.uniquePiecesCollection.doc(id).update({ ...piece, updatedAt: new Date() });
  }

  deleteUniquePiece(id: string): Promise<void> {
    return this.uniquePiecesCollection.doc(id).delete();
  }

  uploadImage(file: File, produitId: string): Observable<string> {
    const filePath = `produits/${produitId}/${file.name}`;
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
}