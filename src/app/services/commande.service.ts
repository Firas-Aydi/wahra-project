import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Commande } from '../model/commande';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandeCollection = this.firestore.collection<Commande>('commandes');

  constructor(private firestore: AngularFirestore) {}

  // Sauvegarder une commande avec l'état initial "en attente"
  saveOrder(commande: Commande, cartItems: any[], totalPrice: number): Promise<void> {
    const commandeId = this.firestore.createId();  // Générer un identifiant unique pour la commande

    const commandeData: Commande & { cartItems: any[], totalPrice: number, timestamp: Date, commandeId: string } = {
      ...commande,
      commandeId: commandeId,
      cartItems: cartItems,
      totalPrice: totalPrice + 7, // Ajouter les frais de livraison
      etat: 'en attente',  // État par défaut
      timestamp: new Date(),
    };

    // Sauvegarder la commande dans Firebase
    return this.commandeCollection.doc(commandeId).set(commandeData);
  }

  // Récupérer toutes les commandes
  getAllCommandes(): Observable<Commande[]> {
    return this.commandeCollection.valueChanges();
  }

  // Mettre à jour l'état d'une commande
  updateCommandeStatus(commandeId: string, newStatus: string): Promise<void> {
    return this.commandeCollection.doc(commandeId).update({ etat: newStatus });
  }

  getPendingCommandesCount(): Observable<number> {
    return this.firestore.collection<Commande>('commandes', ref => ref.where('etat', '==', 'en attente'))
      .valueChanges()
      .pipe(map((commandes: Commande[]) => commandes.length));
  }
}
