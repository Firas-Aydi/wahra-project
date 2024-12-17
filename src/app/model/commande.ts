export interface Commande {
    commandeId?: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    codePostal: string;
    email: string;
    phone: string;
    notes?: string;
    totalPrice?: number;
    etat: string;
    timestamp?: any;
    cartItems?: {
      product: {
        name: string;
        // description: string;
        // dimensions: string;
        // material: string;
        // colors: string[];
        price: number;
        images: string[];
      };
      quantity: number;
    }[];  // Propriété des articles commandés
  }
  