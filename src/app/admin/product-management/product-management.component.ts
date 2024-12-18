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
    return cat?.name || 'Non défini';
  }
  getPierreName(pierreId: string): string {
    const p = this.pierres.find((p) => p.id === pierreId);
    return p?.name || 'Non défini';
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
      const produitId =
        this.editingIndex === null
          ? this.productService.generateId()
          : this.produits[this.editingIndex].id;

      // Téléchargez les nouvelles images
      const newImages = await this.uploadFiles(produitId);

      // Combinez les anciennes images avec les nouvelles (si en édition)
      const existingImages =
        this.editingIndex !== null
          ? this.produits[this.editingIndex].images || []
          : [];
      const images = [...existingImages, ...newImages];

      const produit = { ...this.form.value, id: produitId, images };

      if (this.editingIndex === null) {
        this.productService.addProduit(produit).then(() => this.resetForm());
      } else {
        this.productService
          .updateProduit(produitId, produit)
          .then(() => this.resetForm());
      }
    }
  }


  editProduit(index: number): void {
    this.editingIndex = index;
    const produit = this.produits[index];
    this.form.patchValue(produit);

    // Réinitialisez les fichiers sélectionnés
    this.selectedFiles = [];

    // Charger les images existantes dans les aperçus
    this.selectedImagePreviews = [...(produit.images || [])];
  }


  deleteProduit(id: string): void {
    this.productService.deleteProduit(id).then(() => this.loadProduits());
  }

  resetForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.editingIndex = null;
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

}
