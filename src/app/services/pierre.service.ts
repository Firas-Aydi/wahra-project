import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Pierre } from '../model/pierre';

@Injectable({
  providedIn: 'root',
})
export class PierreService {
  private collectionName = 'pierres';

  constructor(private firestore: AngularFirestore) {}

  getPierres(): Observable<Pierre[]> {
    return this.firestore.collection<Pierre>(this.collectionName).valueChanges();
  }

  addPierre(pierre: Pierre) {
    const id = this.firestore.createId();
    pierre.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(pierre);
  }

  getPierreById(id: string): Observable<Pierre | undefined> {
    return this.firestore.collection(this.collectionName).doc<Pierre>(id).valueChanges();
  }

  deletePierre(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
