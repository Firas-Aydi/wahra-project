// Service: NewsService
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly collectionName = 'newProducts';

  constructor(private firestore: AngularFirestore) { }

  // Récupérer tous les nouveaux produits
  getNewProducts(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Ajouter un nouveau produit
  addNewProduct(product: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...product, id });
  }

  // Supprimer un produit
  deleteProduct(productId: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(productId).delete();
  }

  // Mettre à jour un produit
  updateProduct(productId: string, updatedData: any): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(productId).update(updatedData);
  }
}
