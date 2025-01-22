export interface UniquePiece {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    videos: string[];
    pierreId?: string[];
    createdAt: Date;
    updatedAt: Date;
}
