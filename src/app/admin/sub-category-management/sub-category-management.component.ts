import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
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
      categoryId: ['', Validators.required],
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

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Non attribuée';
  }

  saveForm(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.editingIndex !== null) {
      // Mise à jour
      const id = this.sousCategories[this.editingIndex].id;
      this.sousCategorieService.updateSousCategorie(id, formValue).then(() => {
        this.sousCategories[this.editingIndex!] = {
          ...this.sousCategories[this.editingIndex!],
          ...formValue,
        };
        this.cancelForm();
      });
    } else {
      // Ajout
      const newSubCategory: SousCategorie = {
        ...formValue,
        id: '',
      };
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
  }
  editSubCategory(index: number): void {
    this.editingIndex = index; // Enregistre l'indice de la sous-catégorie à modifier
    const subCategory = this.sousCategories[index];
    this.form.patchValue({
      name: subCategory.name,
      categoryId: subCategory.categoryId,
    });
  }
  
  deleteSubCategory(id: string): void {
    this.sousCategorieService.deleteSousCategorie(id).then(() => {
      this.loadSousCategories();
    });
  }
}
