import { Produit } from "./produit";

export interface Pierre {
    id: string; // Identifiant unique
    name: string; // Nom de la pierre (ex : Améthyste)
    description: string; // Description ou bienfaits de la pierre
    produits?: Produit[]; // Liste des produits utilisant cette pierre
  }
  