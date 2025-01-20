export interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; // Liste des URLs des images
  videos: string[]; // Liste des URLs des vidéos
  sousCategoryId: string;
  pierreId?: string[];
  createdAt: Date;
  updatedAt: Date;
}
