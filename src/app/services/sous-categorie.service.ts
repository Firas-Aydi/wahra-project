import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { SousCategorie } from '../model/sous-categorie';

@Injectable({
  providedIn: 'root',
})
export class SousCategorieService {
  private collection = this.firestore.collection<SousCategorie>('sousCategories');

  constructor(private firestore: AngularFirestore) {}

  getSubCategoriesByCategory(categoryId: string): Observable<SousCategorie[]> {
    return this.firestore
      .collection<SousCategorie>('sub-categories', (ref) =>
        ref.where('categoryId', '==', categoryId)
      )
      .valueChanges({ idField: 'id' });
  }

  addSubCategory(subCategory: SousCategorie): Promise<void> {
    const id = this.firestore.createId();
    return this.collection.doc(id).set({ ...subCategory, id });
  }

  updateSubCategory(id: string, subCategory: Partial<SousCategorie>): Promise<void> {
    return this.collection.doc(id).update(subCategory);
  }

  deleteSubCategory(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}
