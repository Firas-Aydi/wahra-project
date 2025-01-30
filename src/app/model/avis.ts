export interface Avis {
    id: string;
    avis: string;
    videos: string[];
    images: string[];
    etoiles: number;
    createdAt: Date;
    updatedAt: Date;
}
