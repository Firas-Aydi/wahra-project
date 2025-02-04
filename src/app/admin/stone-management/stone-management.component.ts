import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Categorie } from 'src/app/model/categorie';
import { Pierre } from 'src/app/model/pierre';
import { CategorieService } from 'src/app/services/categorie.service';
import { PierreService } from 'src/app/services/pierre.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stone-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './stone-management.component.html',
  styleUrls: ['./stone-management.component.css'],
})
export class StoneManagementComponent implements OnInit {
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any> | null = null;

  pierres: Pierre[] = [];
  form: FormGroup;
  editingIndex: number | null = null; // Pour suivre l'édition
  selectedFile: File | null = null; // Fichier sélectionné
  isUploading = false;
  categories: Categorie[] = [];

  productToDeleteId: string | null = null; // ID du produit à supprimer
  productToDeleteImageUrl: string | null = null;

  searchTerm: string = '';

  constructor(
    private pierreService: PierreService,
    private categorieService: CategorieService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      bienfaits: ['', Validators.required],
      images: [[]],
      categoryId: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPierres();
    this.form.patchValue({ images: [] });
  }

  loadPierres(): void {
    this.pierreService.getPierres().subscribe((data) => {
      this.pierres = data;
    });
  }
  loadCategories(): void {
    this.categorieService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  get categoryIdArray() {
    return this.form.get('categoryId') as FormArray;
  }

    filteredProduits(): Pierre[] {
      if (!this.searchTerm) {
        return this.pierres;
      }
      return this.pierres.filter(produit =>
        produit.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

  onCategoryChange(categoryId: string, event: Event): void {
    const input = event.target as HTMLInputElement; // Cast de l'event.target vers un input HTML
    const isChecked = input.checked;

    const categoryArray = this.categoryIdArray;
    if (isChecked) {
      categoryArray.push(new FormControl(categoryId));
    } else {
      const index = categoryArray.controls.findIndex(
        (control) => control.value === categoryId
      );
      if (index !== -1) {
        categoryArray.removeAt(index);
      }
    }
  }

  getCategoryNames(categoryIds: string[]): string {
    return categoryIds
      .map((id) => {
        const category = this.categories.find((cat) => cat.id === id);
        return category?.name;
        // return category ? category.name : 'Non attribuée';
      })
      .join(', ');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files); // Récupère les fichiers sélectionnés
      this.isUploading = true;
  
      files.forEach((file) => {
        // Upload chaque fichier dans Firebase Storage
        this.pierreService.uploadImage(file).subscribe((url) => {
          const imagesArray = this.form.get('images')?.value || [];
          imagesArray.push(url); // Ajoute l'URL dans le tableau d'images
          this.form.patchValue({ images: imagesArray });
          this.isUploading = false;
        });
      });
    }
  }
  
  removeImage(imageUrl: string): void {
    const imagesArray = this.form.get('images')?.value || [];
    const index = imagesArray.indexOf(imageUrl);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'URL de l'image du tableau
      this.form.patchValue({ images: imagesArray });
  
      // Supprime l'image de Firebase Storage
      this.pierreService.deleteImage(imageUrl).catch((error) => {
        console.error('Erreur lors de la suppression de l\'image :', error);
      });
    }
  }
  


  saveForm(): void {
    if (this.form.invalid || !this.form.value.images) {
      alert('Veuillez remplir tous les champs et ajouter une image.');
      return;
    }

    if (this.selectedFile) {
      this.isUploading = true;
      this.pierreService.uploadImage(this.selectedFile).subscribe((url) => {
        this.isUploading = false;
        this.form.patchValue({ image: url });
        this.savePierre();
      });
    } else {
      this.savePierre();
    }
  }

  savePierre(): void {
    const formValue = this.form.value;
  
    if (this.editingIndex !== null) {
      const id = this.pierres[this.editingIndex].id;
      this.pierreService.updatePierre(id, formValue).then(() => {
        this.pierres[this.editingIndex!] = { ...formValue, id };
        this.cancelForm();
      });
    } else {
      const newPierre: Pierre = { ...formValue, id: '' };
      this.pierreService.addPierre(newPierre).then(() => {
        this.loadPierres();
        this.cancelForm();
      });
    }
  }
  
  editPierre(index: number): void {
    this.editingIndex = index;
    const pierre = this.pierres[index];
    this.form.patchValue(pierre);
  }
  openConfirmationModal(id: string, imageUrl: string) {
    this.productToDeleteId = id; // Stocke l'ID de la pierre à supprimer
    this.productToDeleteImageUrl = imageUrl || null; // Stocke l'URL de l'image à supprimer ou null si aucune image
    this.modalService.open(this.confirmationModal); // Ouvre le modal
  }
  
  confirmDelete(): void {
    if (this.productToDeleteId) {
      this.pierreService.deletePierre(this.productToDeleteId).then(() => {
        if (this.productToDeleteImageUrl) {
          this.pierreService.deleteImage(this.productToDeleteImageUrl).then(() => {
            console.log('Image supprimée avec succès');
          }).catch((error) => {
            console.error('Erreur lors de la suppression de l\'image :', error);
          });
        }
        this.loadPierres(); // Recharge les pierres après suppression
        this.modalService.dismissAll(); // Ferme le modal
      }).catch((error) => {
        console.error('Erreur lors de la suppression de la pierre :', error);
      });
    }
  }

  cancelForm(): void {
    this.form.reset();
    this.selectedFile = null;
    this.editingIndex = null;
    this.productToDeleteId = null; // Réinitialise l'ID de la pierre à supprimer
    this.productToDeleteImageUrl = null; // Réinitialise l'URL de l'image à supprimer
  }

}
