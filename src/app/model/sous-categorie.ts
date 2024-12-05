import { Produit } from "./produit";

export interface SousCategorie {
    id: string; // Identifiant unique
    name: string; // Nom de la sous-catégorie (ex : Collier)
    description?: string; // Description optionnelle
    produits: Produit[]; // Produits associés à la sous-catégorie
  }
  