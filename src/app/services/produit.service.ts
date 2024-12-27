import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Produit } from '../model/produit';
import { SousCategorie } from '../model/sous-categorie';
import { Pierre } from '../model/pierre';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collectionName = 'produits';

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getProduits(): Observable<Produit[]> {
    return this.firestore.collection<Produit>(this.collectionName).valueChanges({ idField: 'id' });
  }
  getProduitById(produitId: string): Observable<Produit | null | undefined> {
    return this.firestore.collection<Produit>(this.collectionName).doc(produitId).valueChanges().pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération de l’produit :', error);
        return of(null); // Retourne `null` en cas d'erreur
      })
    );;
  }

  generateId(): string {
    return this.firestore.createId();
  }
  getProductsBySousCategorie(sousCategorieId: string): Observable<any[]> {
    return this.firestore
      .collection('produits', (ref) =>
        ref.where('sousCategoryId', '==', sousCategorieId)
      )
      .valueChanges();
  }
  getProductsByPierre(pierreId: string): Observable<Produit[]> {
    return this.firestore
      .collection<Produit>('produits', (ref) =>
        ref.where('pierreId', 'array-contains', pierreId)
      )
      .valueChanges({ idField: 'id' });
  }
  
  addProduit(produit: Produit): Promise<void> {
    const id = this.generateId()
    produit.id = id;
    produit.createdAt = new Date();
    produit.updatedAt = new Date();
    return this.firestore.collection(this.collectionName).doc(id).set(produit);
  }

  updateProduit(id: string, produit: Partial<Produit>): Promise<void> {
    produit.updatedAt = new Date();
    return this.firestore.collection(this.collectionName).doc(id).update(produit);
  }

  deleteProduit(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
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
  // searchProduits(term: string): Observable<Produit[]> {
  //   return this.firestore
  //     .collection<Produit>('produits', (ref) =>
  //       ref.where('name', '>=', term).where('name', '<=', term + '\uf8ff')
  //     )
  //     .valueChanges();
  // }
  
}