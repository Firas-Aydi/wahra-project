import { PanierItem } from "./panier-item";

export interface Panier {
    id: string; // Identifiant unique
    userId: string; // Identifiant de l'utilisateur associé
    items: PanierItem[]; // Liste des produits dans le panier
    totalPrice: number; // Prix total du panier
  }
  