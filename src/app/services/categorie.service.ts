import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Categorie } from '../model/categorie';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private categoriesCollection = this.firestore.collection<Categorie>('categories');

  constructor(private firestore: AngularFirestore) {}

  // getCategories(): Observable<Categorie[]> {
  //   return this.categoriesCollection.collection<Categorie>(this.collectionName).valueChanges();
  // }

  // addCategorie(categorie: Categorie) {
  //   const id = this.firestore.createId();
  //   categorie.id = id;
  //   return this.firestore.collection(this.collectionName).doc(id).set(categorie);
  // }

  // getCategorieById(id: string): Observable<Categorie | undefined> {
  //   return this.firestore.collection(this.collectionName).doc<Categorie>(id).valueChanges();
  // }
  getCategories(): Observable<Categorie[]> {
    return this.categoriesCollection.valueChanges({ idField: 'id' });
  }

  addCategorie(Categorie: Categorie): Promise<void> {
    const id = this.firestore.createId();
    return this.categoriesCollection.doc(id).set({ ...Categorie, id });
  }

  updateCategorie(id: string, Categorie: Partial<Categorie>): Promise<void> {
    return this.categoriesCollection.doc(id).update(Categorie);
  }

  deleteCategorie(id: string): Promise<void> {
    return this.categoriesCollection.doc(id).delete();
  }
}
