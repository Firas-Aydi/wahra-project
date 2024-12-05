import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Categorie } from '../model/categorie';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private collectionName = 'categories';

  constructor(private firestore: AngularFirestore) {}

  getCategories(): Observable<Categorie[]> {
    return this.firestore.collection<Categorie>(this.collectionName).valueChanges();
  }

  addCategorie(categorie: Categorie) {
    const id = this.firestore.createId();
    categorie.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(categorie);
  }

  getCategorieById(id: string): Observable<Categorie | undefined> {
    return this.firestore.collection(this.collectionName).doc<Categorie>(id).valueChanges();
  }

  deleteCategorie(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
