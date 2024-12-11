import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Categorie } from 'src/app/model/categorie';
import { Pierre } from 'src/app/model/pierre';
import { CategorieService } from 'src/app/services/categorie.service';
import { PierreService } from 'src/app/services/pierre.service';

@Component({
  selector: 'app-stone-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stone-management.component.html',
  styleUrls: ['./stone-management.component.css'],
})
export class StoneManagementComponent implements OnInit {
  pierres: Pierre[] = [];
  form: FormGroup;
  editingIndex: number | null = null; // Pour suivre l'édition
  selectedFile: File | null = null; // Fichier sélectionné
  isUploading = false;
  categories: Categorie[] = [];

  constructor(
    private pierreService: PierreService,
    private categorieService: CategorieService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      bienfaits: ['', Validators.required],
      image: ['', Validators.required],
      categoryId: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPierres();
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
  
  onCategoryChange(categoryId: string, event: Event): void {
    const input = event.target as HTMLInputElement;  // Cast de l'event.target vers un input HTML
    const isChecked = input.checked;
    
    const categoryArray = this.categoryIdArray;
    if (isChecked) {
      categoryArray.push(new FormControl(categoryId));
    } else {
      const index = categoryArray.controls.findIndex((control) => control.value === categoryId);
      if (index !== -1) {
        categoryArray.removeAt(index);
      }
    }
  }
  
  getCategoryNames(categoryIds: string[]): string {
    return categoryIds
      .map((id) => {
        const category = this.categories.find((cat) => cat.id === id);
        return category?.name
        // return category ? category.name : 'Non attribuée';
      })
      .join(', ');
  }
  
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Fichier sélectionné :', this.selectedFile.name);

      // Mettre à jour le formulaire avec le nom du fichier temporairement
      this.form.patchValue({ image: this.selectedFile.name });
      this.form.get('image')?.updateValueAndValidity(); // Valider le champ
    }
  }

  saveForm(): void {
    if (this.form.invalid || !this.form.value.image) {
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

  cancelForm(): void {
    this.form.reset();
    this.selectedFile = null;
    this.editingIndex = null;
  }

  editPierre(index: number): void {
    this.editingIndex = index;
    const pierre = this.pierres[index];
    this.form.patchValue(pierre);
  }

  deletePierre(id: string, imageUrl: string): void {
    this.pierreService.deletePierre(id).then(() => {
      if (imageUrl) this.pierreService.deleteImage(imageUrl); // Supprime l'image
      this.loadPierres();
    });
  }
}
