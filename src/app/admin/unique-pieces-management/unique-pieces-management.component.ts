import { Component, OnInit } from '@angular/core';
import { UniquePieceService } from 'src/app/services/unique-piece.service';
import { UniquePiece } from 'src/app/model/unique-piece';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PierreService } from 'src/app/services/pierre.service';

@Component({
  selector: 'app-unique-pieces-management',
  templateUrl: './unique-pieces-management.component.html',
  styleUrls: ['./unique-pieces-management.component.css']
})
export class UniquePiecesManagementComponent implements OnInit {
  uniquePieces: UniquePiece[] = [];
  selectedPiece: UniquePiece | null = null;
  form: FormGroup;
  isEditing: boolean = false;
  pierres: any[] = [];
  editingIndex: number | null = null;
  isUploading = false;

  selectedFiles: File[] = [];
  selectedImagePreviews: string[] = [];

  showConfirmationModal: boolean = false;
  productToDeleteId: string | null = null;

  selectedVideoPreviews: string[] = [];
  selectedVideoFiles: File[] = [];

  searchTerm: string = '';

  constructor(
    private uniquePieceService: UniquePieceService,
    private pierreService: PierreService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: [[]],
      videos: [[]],
      pierreId: [[]]
    });
  }

  ngOnInit(): void {
    this.loadUniquePieces();
    this.loadPierres();
  }

  loadUniquePieces(): void {
    this.uniquePieceService.getAllUniquePieces().subscribe(
      (pieces) => {
        this.uniquePieces = pieces;
      },
      (error) => {
        console.error('Error loading unique pieces:', error);
      }
    );
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
  getPierreNames(pierreIds: string[] | null): string {
    if (!pierreIds || !Array.isArray(pierreIds)) {
      return 'Aucune pierre';
    }
    return pierreIds.map(id => this.pierres.find(p => p.id === id)?.name || 'Aucune pierre').join(', ');
  }

    filteredProduits(): UniquePiece[] {
      if (!this.searchTerm) {
        return this.uniquePieces;
      }
      return this.uniquePieces.filter(produit =>
        produit.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

  selectPiece(piece: UniquePiece): void {
    this.selectedPiece = piece;
    this.isEditing = true;
    this.form.patchValue(piece);
  }

  clearSelection(): void {
    this.selectedPiece = null;
    this.isEditing = false;
    this.form.reset();
  }

  savePiece(): void {
    if (this.form.invalid) {
      return;
    }

    const pieceData = this.form.value;

    if (this.isEditing && this.selectedPiece) {
      this.uniquePieceService.updateUniquePiece(this.selectedPiece.id, pieceData).then(() => {
        this.loadUniquePieces();
        this.clearSelection();
      }).catch((error) => {
        console.error('Error updating piece:', error);
      });
    } else {
      this.uniquePieceService.addUniquePiece(pieceData).then(() => {
        this.loadUniquePieces();
        this.clearSelection();
      }).catch((error) => {
        console.error('Error adding piece:', error);
      });
    }
  }
async addProduit() {
    if (this.form.valid) {
      const produitId = this.editingIndex === null
        ? this.uniquePieceService.generateId()
        : this.uniquePieces[this.editingIndex].id;
  
      const newImages = await this.uploadFiles(produitId);
      const newVideos = await this.uploadVideoFiles(produitId);
  
      const existingImages = this.editingIndex !== null ? this.uniquePieces[this.editingIndex].images || [] : [];
      const existingVideos = this.editingIndex !== null ? this.uniquePieces[this.editingIndex].videos || [] : [];
  
      const images = [...existingImages, ...newImages];
      const videos = [...existingVideos, ...newVideos];
  
      const produit: UniquePiece = {
        ...this.form.value,
        id: produitId,
        images,
        videos,
        createdAt: this.editingIndex === null ? new Date() : this.uniquePieces[this.editingIndex].createdAt,
        updatedAt: new Date()
      };
  
      if (this.editingIndex === null) {
        this.uniquePieceService.addUniquePiece(produit).then(() => this.resetForm());
      } else {
        this.uniquePieceService.updateUniquePiece(produitId, produit).then(() => this.resetForm());
      }
    }
  }

  editProduit(index: number): void {
    this.editingIndex = index;
    const produit = this.uniquePieces[index];
    this.form.patchValue({ ...produit, pierreId: produit.pierreId || [] }); // Assurez-vous d'envoyer un tableau
    this.selectedFiles = [];
    this.selectedImagePreviews = [...(produit.images || [])];
    this.selectedVideoPreviews = [...(produit.videos || [])];
  }

  deletePiece(id: string): void {
    this.uniquePieceService.deleteUniquePiece(id).then(() => {
      this.loadUniquePieces();
    }).catch((error) => {
      console.error('Error deleting piece:', error);
    });
  }

  resetForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.editingIndex = null;
    this.selectedVideoPreviews = [];
    this.selectedVideoFiles= [];
    this.loadUniquePieces();
    this.selectedImagePreviews = [];
  }

  async uploadFiles(produitId: string): Promise<string[]> {
    this.isUploading = true;
    const urls: string[] = [];
    for (const file of this.selectedFiles) {
      const url = await new Promise<string>((resolve) =>
        this.uniquePieceService
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
      this.uniquePieces[this.editingIndex].images.splice(index, 1);
      this.selectedImagePreviews.splice(index, 1);
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
      this.uniquePieces[this.editingIndex].videos.splice(index, 1);
      this.selectedVideoPreviews.splice(index, 1);
    }
  }

  async uploadVideoFiles(produitId: string): Promise<string[]> {
    this.isUploading = true;
    const urls: string[] = [];
    for (const file of this.selectedVideoFiles) {
      const url = await new Promise<string>((resolve) =>
        this.uniquePieceService
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
      this.uniquePieceService.deleteUniquePiece(this.productToDeleteId).then(() => {
        this.loadUniquePieces();
        this.closeConfirmationModal();
      });
    }
  }
}
