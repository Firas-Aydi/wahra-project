import { Component, OnInit } from '@angular/core';
import { Categorie } from '../model/categorie';
import { CategorieService } from '../services/categorie.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Categorie[] = []; // Liste des catégories
  isLoading: boolean = true; // Indicateur de chargement

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    // Charger les catégories depuis le service
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        this.isLoading = false;
      }
    });
  }
}
