import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Categorie } from '../model/categorie';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private categoriesCollection = this.firestore.collection<Categorie>('categories');

  constructor(private firestore: AngularFirestore) { }

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
  // searchCategories(term: string): Observable<Categorie[]> {
  //   return this.firestore
  //     .collection<Categorie>('categories', (ref) =>
  //       ref
  //         .orderBy('name')
  //         .startAt(term)
  //         .endAt(term + '\uf8ff')
  //     )
  //     .valueChanges({ idField: 'id' });
  // }
}
