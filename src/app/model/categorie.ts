import { Pierre } from './pierre';
import { SousCategorie } from './sous-categorie';

export interface Categorie {
    id: string; // Identifiant unique
    name: string; // Nom de la catégorie (ex : Bijoux en Pierre)
    description?: string; // Description optionnelle de la catégorie
    subCategories?: SousCategorie[]; // Sous-catégories associées
    pierres?: Pierre[]; // Pierres associées (pour Bijoux par Pierre ou Bienfaits et Vertus)
  }
  