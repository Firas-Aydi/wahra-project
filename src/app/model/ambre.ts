export interface Ambre {
    id: string; // Unique identifier for the product
    name: string; // Name of the product
    price: number; // Price of the product
    description: string; // Description of the product
    images: string[];
    // category: string; // Category the product belongs to
    stock: number; // Number of items available in stock
    // tags: string[]; // Array of tags for filtering or categorizing
    createdAt: Date; // Date the product was created
    updatedAt: Date; // Date the product was last updated
    // ratings: number; // Average rating of the product
    // reviewsCount: number; // Number of reviews the product has
    // discount: number; // Discount on the product, if any
    // isFeatured: boolean; // Whether the product is featured
}
