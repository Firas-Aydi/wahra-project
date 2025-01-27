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
import { forkJoin } from 'rxjs';

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

  selectedFile: File | null = null;
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
      categoryId: [''],
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
  // onFileChange(event: any) {
  //   const files: FileList = event.target.files;
  //   this.selectedFiles = Array.from(files);

  //   // Générez les URLs de prévisualisation
  //   this.selectedImagePreviews = [];
  //   for (const file of this.selectedFiles) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImagePreviews.push(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // Ajoutez une méthode pour supprimer une image sélectionnée
  removeImage(imageUrl: string): void {
    const imagesArray = this.form.get('images')?.value || [];
    const index = imagesArray.indexOf(imageUrl);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'URL de l'image du tableau
      this.form.patchValue({ images: imagesArray });

      // Supprime l'image de Firebase Storage
      this.productService.deleteImage(imageUrl).catch((error) => {
        console.error('Erreur lors de la suppression de l\'image :', error);
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files); // Récupérer tous les fichiers sélectionnés
      this.isUploading = true;

      const uploadObservables = files.map((file) =>
        this.productService.uploadImage(file)
      );

      // Traiter tous les fichiers en parallèle
      forkJoin(uploadObservables).subscribe(
        (urls) => {
          const imagesArray = this.form.get('images')?.value || [];
          this.form.patchValue({ images: [...imagesArray, ...urls] });
          this.isUploading = false;
        },
        (error) => {
          console.error('Erreur lors de l\'upload :', error);
          this.isUploading = false;
        }
      );
    }
  }

  // async uploadFiles(produitId: string): Promise<string[]> {
  //   this.isUploading = true;
  //   const urls: string[] = [];
  //   for (const file of this.selectedFiles) {
  //     const url = await new Promise<string>((resolve) =>
  //       this.productService
  //         .uploadImage(file, produitId)
  //         .subscribe((downloadUrl) => {
  //           resolve(downloadUrl);
  //         })
  //     );
  //     urls.push(url);
  //   }
  //   this.isUploading = false;
  //   return urls;
  // }

  // async addProduit() {
  //   if (this.form.valid) {
  //     const produitId = this.editingIndex === null
  //       ? this.productService.generateId()
  //       : this.produits[this.editingIndex].id;

  //     const newImages = await this.uploadFiles(produitId);
  //     const newVideos = await this.uploadVideoFiles(produitId);

  //     const existingImages = this.editingIndex !== null ? this.produits[this.editingIndex].images || [] : [];
  //     const existingVideos = this.editingIndex !== null ? this.produits[this.editingIndex].videos || [] : [];

  //     const images = [...existingImages, ...newImages];
  //     const videos = [...existingVideos, ...newVideos];

  //     const produit: Produit = {
  //       ...this.form.value,
  //       id: produitId,
  //       images,
  //       videos,
  //       createdAt: this.editingIndex === null ? new Date() : this.produits[this.editingIndex].createdAt,
  //       updatedAt: new Date()
  //     };

  //     if (this.editingIndex === null) {
  //       this.productService.addProduit(produit).then(() => this.resetForm());
  //     } else {
  //       this.productService.updateProduit(produitId, produit).then(() => this.resetForm());
  //     }
  //   }
  // }

  editProduit(index: number): void {
    this.editingIndex = index;
    const produit = this.produits[index];
    this.form.patchValue({ ...produit, pierreId: produit.pierreId || [] }); // Assurez-vous d'envoyer un tableau
    this.selectedFiles = [];
    this.selectedImagePreviews = [...(produit.images || [])];
    this.selectedVideoPreviews = [...(produit.videos || [])];
  }

  saveForm(): void {
    if (this.form.invalid || !this.form.value.images) {
      alert('Veuillez remplir tous les champs et ajouter une image.');
      return;
    }

    if (this.selectedFile) {
      this.isUploading = true;
      this.productService.uploadImage(this.selectedFile).subscribe((url) => {
        this.isUploading = false;
        this.form.patchValue({ image: url });
        this.saveProduit();
      });
    } else {
      this.saveProduit();
    }
  }

  saveProduit(): void {
    const formValue = this.form.value;

    if (this.editingIndex !== null) {
      const id = this.produits[this.editingIndex].id;
      this.productService.updateProduit(id, formValue).then(() => {
        this.produits[this.editingIndex!] = { ...formValue, id };
        this.resetForm();
      });
    } else {
      const newProduit: Produit = { ...formValue, id: '' };
      this.productService.addProduit(newProduit).then(() => {
        this.loadProduits();
        this.resetForm();
      });
    }
  }

  deleteProduit(id: string): void {
    this.productService.deleteProduit(id).then(() => this.loadProduits());
  }

  resetForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.editingIndex = null;
    this.selectedVideoPreviews = [];
    this.selectedVideoFiles = [];
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.isUploading = true;
      const uploadObservables = files.map((file) =>
        this.productService.uploadImage(file)
      );

      // Traiter tous les fichiers en parallèle
      forkJoin(uploadObservables).subscribe(
        (urls) => {
          const videosArray = this.form.get('videos')?.value || [];
          this.form.patchValue({ videos: [...videosArray, ...urls] });
          this.isUploading = false;
        },
        (error) => {
          console.error('Erreur lors de l\'upload :', error);
          this.isUploading = false;
        }
      );
    }
  }

  removeSelectedVideo(videoUrl: string): void {
    const videosArray = this.form.get('videos')?.value || [];
    const index = videosArray.indexOf(videoUrl);
    if (index > -1) {
      videosArray.splice(index, 1); // Supprime l'URL de l'image du tableau
      this.form.patchValue({ videos: videosArray });

      // Supprime l'image de Firebase Storage
      this.productService.deleteImage(videoUrl).catch((error) => {
        console.error('Erreur lors de la suppression de le vidéo :', error);
      });
    }
  }

  // async uploadVideoFiles(produitId: string): Promise<string[]> {
  //   this.isUploading = true;
  //   const urls: string[] = [];
  //   for (const file of this.selectedVideoFiles) {
  //     const url = await new Promise<string>((resolve) =>
  //       this.productService
  //         .uploadImage(file) // Utilisez la même logique que pour les images
  //         .subscribe((downloadUrl) => {
  //           resolve(downloadUrl);
  //         })
  //     );
  //     urls.push(url);
  //   }
  //   this.isUploading = false;
  //   return urls;
  // }
  toggleNouveautes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.form.patchValue({
      categoryId: isChecked ? 'xTbMiPrHVtXUZoNUAd6H' : ''
    });
  }

}
