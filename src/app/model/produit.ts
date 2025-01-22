export interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  videos: string[];
  sousCategoryId: string;
  categoryId?: string; // Peut inclure la valeur pour Nouveautés
  pierreId?: string[];
  createdAt: Date;
  updatedAt: Date;
}
