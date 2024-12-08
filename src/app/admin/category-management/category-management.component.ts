import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categorie } from 'src/app/model/categorie';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  categories: Categorie[] = [];
  categoryForm: FormGroup;
  isEditMode: boolean = false; // Indique si on est en mode édition
  selectedCategoryId: string | null = null; // ID de la catégorie à modifier

  constructor(
    private categoryService: CategorieService,
    private fb: FormBuilder
  ) {
    // Initialiser le formulaire réactif
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      // description: [''],
      // image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  cancel(): void {
    this.isEditMode = false; // Mode ajout
    this.selectedCategoryId = null;
    this.categoryForm.reset(); // Réinitialiser le formulaire
  }

  editCategory(category: Categorie): void {
    this.isEditMode = true; // Mode édition
    this.selectedCategoryId = category.id; // Stocker l'ID de la catégorie à modifier
    this.categoryForm.patchValue({
      name: category.name,
      // description: category.description,
      // image: category.image,
    });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategorie(id).then(() => {
      console.log('Catégorie supprimée');
      this.loadCategories(); // Recharger les catégories après suppression
    });
  }

  submitCategoryForm(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      if (this.isEditMode && this.selectedCategoryId) {
        // Mise à jour de la catégorie
        this.categoryService.updateCategorie(this.selectedCategoryId, categoryData).then(() => {
          console.log('Catégorie mise à jour');
          this.loadCategories();
          this.categoryForm.reset();
          this.isEditMode = false;
        });
      } else {
        // Ajout d'une nouvelle catégorie
        this.categoryService.addCategorie(categoryData).then(() => {
          console.log('Catégorie ajoutée');
          this.loadCategories();
          this.categoryForm.reset();
        });
      }
    }
  }
}
