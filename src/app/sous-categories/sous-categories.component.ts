import { Component, OnInit } from '@angular/core';
import { SousCategorieService } from '../services/sous-categorie.service';
import { ActivatedRoute } from '@angular/router';
import { Produit } from '../model/produit';

@Component({
  selector: 'app-sous-categories',
  templateUrl: './sous-categories.component.html',
  styleUrls: ['./sous-categories.component.css']
})
export class SousCategoriesComponent implements OnInit {
  products: Produit[] = [];
  categorieId: string = '';

  constructor(
    private route: ActivatedRoute,
    private sousCategorieService: SousCategorieService
  ) {}

  ngOnInit(): void {
    
    // Écouter les changements de paramètres dans l'URL
    this.route.paramMap.subscribe((params) => {
      this.categorieId = params.get('categorieId') || '';
      if (this.categorieId) {
        this.loadProductsByCategorySousCategorie(this.categorieId);
        this.loadProductsByCategoryPierre(this.categorieId);
      }
    });
    
  }
  loadProductsByCategorySousCategorie(categoryId: string): void {
    this.sousCategorieService.getProductsByCategorySousCategorie(categoryId).subscribe(
      (products) => {
        this.products = products;
        // console.log('Produits chargés pour la catégorie :', this.products);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
  loadProductsByCategoryPierre(categoryId: string): void {
    this.sousCategorieService.getProductsByCategoryPierre(categoryId).subscribe(
      (products) => {
        this.products = products;
        // console.log('Produits chargés pour la catégorie :', this.products);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
}
