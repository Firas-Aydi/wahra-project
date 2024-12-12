import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { SousCategorie } from '../model/sous-categorie';
import { Pierre } from '../model/pierre';
import { Produit } from '../model/produit';

@Injectable({
  providedIn: 'root',
})
export class SousCategorieService {
  private collection = this.firestore.collection<SousCategorie>('sousCategories');

  constructor(private firestore: AngularFirestore) {}

  getSousCategoriesByCategory(categoryId: string): Observable<SousCategorie[]> {
    return this.firestore
      .collection<SousCategorie>('sub-categories', (ref) =>
        ref.where('categoryId', '==', categoryId)
      )
      .valueChanges({ idField: 'id' });
  }
  getSousCategories(): Observable<SousCategorie[]> {
    return this.collection.valueChanges({ idField: 'id' });
  }
  getProductsByCategorySousCategorie(categoryId: string): Observable<Produit[]> {
    return this.firestore.collection<SousCategorie>('sousCategories', ref => ref.where('categoryId', 'array-contains', categoryId))
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap((sousCategories) => {
          const sousCategoryIds = sousCategories.map(sc => sc.id);
          if (sousCategoryIds.length === 0) {
            return of([]);
          }
          return this.firestore.collection<Produit>('produits', ref =>
            ref.where('sousCategoryId', 'in', sousCategoryIds)
          ).valueChanges({ idField: 'id' });
        })
      );
  }
  getProductsByCategoryPierre(categoryId: string): Observable<Produit[]> {
    return this.firestore.collection<Pierre>('pierres', ref => ref.where('categoryId', 'array-contains', categoryId))
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap((pierres) => {
          const pierreIds = pierres.map(p => p.id);
          if (pierreIds.length === 0) {
            return of([]);
          }
          return this.firestore.collection<Produit>('produits', ref =>
            ref.where('pierreId', 'in', pierreIds)
          ).valueChanges({ idField: 'id' });
        })
      );
  }
  addSousCategorie(subCategory: SousCategorie): Promise<void> {
    const id = this.firestore.createId();
    return this.collection.doc(id).set({ ...subCategory, id });
  }

  updateSousCategorie(id: string, subCategory: Partial<SousCategorie>): Promise<void> {
    return this.collection.doc(id).update(subCategory);
  }

  deleteSousCategorie(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}
