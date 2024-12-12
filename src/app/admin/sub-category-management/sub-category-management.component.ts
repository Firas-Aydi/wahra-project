import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SousCategorie } from 'src/app/model/sous-categorie';
import { SousCategorieService } from 'src/app/services/sous-categorie.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { Categorie } from 'src/app/model/categorie';

@Component({
  selector: 'app-sub-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sub-category-management.component.html',
  styleUrls: ['./sub-category-management.component.css'],
})
export class SubCategoryManagementComponent implements OnInit {
  sousCategories: SousCategorie[] = [];
  form: FormGroup; // Formulaire pour l'ajout/modification
  editingIndex: number | null = null; // Indice de l'élément en cours de modification
  categories: Categorie[] = [];

  constructor(
    private sousCategorieService: SousCategorieService,
    private categorieService: CategorieService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      categoryId: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadSousCategories();
    this.loadCategories();
  }

  loadSousCategories(): void {
    this.sousCategorieService.getSousCategories().subscribe((data) => {
      this.sousCategories = data;
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
    const input = event.target as HTMLInputElement;
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
  saveForm(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    if (this.editingIndex !== null) {
      // Mise à jour
      const id = this.sousCategories[this.editingIndex].id;
      this.sousCategorieService.updateSousCategorie(id, formValue).then(() => {
        this.sousCategories[this.editingIndex!] = { ...formValue, id };
        this.cancelForm();
      });
    } else {
      // Ajout
      const newSubCategory: SousCategorie = { ...formValue, id: '' };
      this.sousCategorieService.addSousCategorie(newSubCategory).then(() => {
        this.sousCategories.push(newSubCategory); // Ajout immédiat pour affichage
        this.loadSousCategories(); // Recharger pour s'assurer de la cohérence
        this.cancelForm();
      });
    }
  }

  cancelForm(): void {
    this.form.reset();
    this.editingIndex = null;
    this.categoryIdArray.clear();
  }

  editSubCategory(index: number): void {
    this.editingIndex = index; // Enregistre l'indice de la sous-catégorie à modifier
    const subCategory = this.sousCategories[index];

    // Patch des données dans le formulaire
    this.form.patchValue({
      name: subCategory.name,
    });

    // Mettre à jour les catégories dans le FormArray
    this.categoryIdArray.clear();
    subCategory.categoryId.forEach((id) =>
      this.categoryIdArray.push(new FormControl(id))
    );
  }

  deleteSubCategory(id: string): void {
    this.sousCategorieService.deleteSousCategorie(id).then(() => {
      this.loadSousCategories();
    });
  }
}
