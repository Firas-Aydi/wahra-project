import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Produit } from '../model/produit';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private collectionName = 'produits';

  constructor(private firestore: AngularFirestore) {}

  getProduits(): Observable<Produit[]> {
    return this.firestore.collection<Produit>(this.collectionName).valueChanges();
  }

  addProduit(produit: Produit) {
    const id = this.firestore.createId();
    produit.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(produit);
  }

  getProduitById(id: string): Observable<Produit | undefined> {
    return this.firestore.collection(this.collectionName).doc<Produit>(id).valueChanges();
  }

  deleteProduit(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
