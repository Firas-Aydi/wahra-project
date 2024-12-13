export interface Produit {
  id: string; // Identifiant unique
  name: string; // Nom du produit
  description: string; // Description du produit
  price: number; // Prix du produit
  stock: number; // Stock disponible
  images: string[]; // Liste des URLs des images
  sousCategoryId: string;
  pierreId?: string;
  createdAt: Date; // Date de création
  updatedAt: Date; // Date de mise à jour
}
