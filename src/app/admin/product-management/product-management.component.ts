import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Produit } from 'src/app/model/produit';
import { ProductService } from 'src/app/services/produit.service';
import { SousCategorieService } from 'src/app/services/sous-categorie.service';
import { PierreService } from 'src/app/services/pierre.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  produits: Produit[] = [];
  sousCategories: any[] = [];
  pierres: any[] = [];
  form: FormGroup;
  selectedFiles: File[] = [];
  editingIndex: number | null = null;
  isUploading = false;

  selectedImagePreviews: string[] = [];
  showConfirmationModal: boolean = false;
  productToDeleteId: string | null = null;

  selectedVideoPreviews: string[] = [];
  selectedVideoFiles: File[] = [];

  constructor(
    private productService: ProductService,
    private sousCategorieService: SousCategorieService,
    private pierreService: PierreService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sousCategoryId: ['', Validators.required],
      pierreId: [''],
      images: [[]],
      videos: [[]],
    });
  }

  ngOnInit(): void {
    this.loadProduits();
    this.loadSousCategories();
    this.loadPierres();
  }

  loadProduits(): void {
    this.productService.getProduits().subscribe((data) => {
      this.produits = data;
    });
  }

  loadSousCategories(): void {
    this.sousCategorieService.getSousCategories().subscribe((data) => {
      if (data) {
        this.sousCategories = data;
      } else {
        console.error('Erreur : données de sous-catégories non disponibles.');
      }
    });
  }

  loadPierres(): void {
    this.pierreService.getPierres().subscribe((data) => {
      if (data) {
        this.pierres = data;
      } else {
        console.error('Erreur : données de pierres non disponibles.');
      }
    });
  }
  getSousCategorieName(sousCategoryId: string): string {
    const cat = this.sousCategories.find((cat) => cat.id === sousCategoryId);
    return cat?.name || 'Aucune pierre';
  }
  // getPierreNames(pierreIds: string[]): string {
  //   return pierreIds.map(id => this.pierres.find(p => p.id === id)?.name || 'Aucune pierre').join(', ');
  // }
  getPierreNames(pierreIds: string[] | null): string {
    if (!pierreIds || !Array.isArray(pierreIds)) {
      return 'Aucune pierre';
    }
    return pierreIds.map(id => this.pierres.find(p => p.id === id)?.name || 'Aucune pierre').join(', ');
  }
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);

    // Générez les URLs de prévisualisation
    this.selectedImagePreviews = [];
    for (const file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Ajoutez une méthode pour supprimer une image sélectionnée
  removeSelectedImage(index: number): void {
    if (this.editingIndex !== null) {
      this.produits[this.editingIndex].images.splice(index, 1);
      this.selectedImagePreviews.splice(index, 1);
    }
  }

  async uploadFiles(produitId: string): Promise<string[]> {
    this.isUploading = true;
    const urls: string[] = [];
    for (const file of this.selectedFiles) {
      const url = await new Promise<string>((resolve) =>
        this.productService
          .uploadImage(file, produitId)
          .subscribe((downloadUrl) => {
            resolve(downloadUrl);
          })
      );
      urls.push(url);
    }
    this.isUploading = false;
    return urls;
  }

  async addProduit() {
    if (this.form.valid) {
      const produitId = this.editingIndex === null
        ? this.productService.generateId()
        : this.produits[this.editingIndex].id;

      const newImages = await this.uploadFiles(produitId);
      const newVideos = await this.uploadVideoFiles(produitId); // Upload des vidéos

      const existingImages = this.editingIndex !== null ? this.produits[this.editingIndex].images || [] : [];
      const existingVideos = this.editingIndex !== null ? this.produits[this.editingIndex].videos || [] : [];

      const images = [...existingImages, ...newImages];
      const videos = [...existingVideos, ...newVideos]; // Combinez les vidéos existantes et nouvelles

      const produit: Produit = { ...this.form.value, id: produitId, images, videos };

      if (this.editingIndex === null) {
        this.productService.addProduit(produit).then(() => this.resetForm());
      } else {
        this.productService.updateProduit(produitId, produit).then(() => this.resetForm());
      }
    }
  }



  editProduit(index: number): void {
    this.editingIndex = index;
    const produit = this.produits[index];
    this.form.patchValue({ ...produit, pierreId: produit.pierreId || [] }); // Assurez-vous d'envoyer un tableau
    this.selectedFiles = [];
    this.selectedImagePreviews = [...(produit.images || [])];
    this.selectedVideoPreviews = [...(produit.videos || [])];
  }


  deleteProduit(id: string): void {
    this.productService.deleteProduit(id).then(() => this.loadProduits());
  }

  resetForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.editingIndex = null;
    this.selectedVideoPreviews = [];
    this.selectedVideoFiles= [];
    this.loadProduits();
    this.selectedImagePreviews = [];
  }

  openConfirmationModal(productId: string): void {
    this.showConfirmationModal = true;
    this.productToDeleteId = productId;
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.productToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.productToDeleteId) {
      this.productService.deleteProduit(this.productToDeleteId).then(() => {
        this.loadProduits();
        this.closeConfirmationModal();
      });
    }
  }



  onVideoFileChange(event: any): void {
    const files: FileList = event.target.files;
    this.selectedVideoFiles = Array.from(files);

    // Générez les URLs de prévisualisation pour les vidéos
    this.selectedVideoPreviews = [];
    for (const file of this.selectedVideoFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedVideoPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedVideo(index: number): void {
    if (this.editingIndex !== null) {
      this.produits[this.editingIndex].videos.splice(index, 1);
      this.selectedVideoPreviews.splice(index, 1);
    }
  }

  async uploadVideoFiles(produitId: string): Promise<string[]> {
    this.isUploading = true;
    const urls: string[] = [];
    for (const file of this.selectedVideoFiles) {
      const url = await new Promise<string>((resolve) =>
        this.productService
          .uploadImage(file, produitId) // Utilisez la même logique que pour les images
          .subscribe((downloadUrl) => {
            resolve(downloadUrl);
          })
      );
      urls.push(url);
    }
    this.isUploading = false;
    return urls;
  }

}
