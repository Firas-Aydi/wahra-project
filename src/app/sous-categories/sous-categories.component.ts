import { Component, OnInit } from '@angular/core';
import { SousCategorieService } from '../services/sous-categorie.service';
import { ActivatedRoute } from '@angular/router';
import { Produit } from '../model/produit';

@Component({
  selector: 'app-sous-categories',
  templateUrl: './sous-categories.component.html',
  styleUrls: ['./sous-categories.component.css'],
})
export class SousCategoriesComponent implements OnInit {
  products: Produit[] = [];
  categorieId: string = '';
  // currentIndex: number = 0;
  visibleProducts: number = 5;
  
  groupedProducts: { [key: string]: Produit[] } = {};
  sousCategories: { id: string; name: string }[] = [];
  currentIndex: { [key: string]: number } = {};
  
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
    this.sousCategorieService
      .getProductsByCategorySousCategorie(categoryId)
      .subscribe(
        (products) => {
this.groupProductsBySousCategorie(products)        },
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

  groupProductsBySousCategorie(products: Produit[]): void {
    const sousCategoryIds = Array.from(
      new Set(products.map((produit) => produit.sousCategoryId))
    );
  
    this.sousCategorieService.getSousCategoriesByIds(sousCategoryIds).subscribe(
      (sousCategories) => {
        this.sousCategories = sousCategories.map((sc) => ({
          id: sc.id,
          name: sc.name,
        }));
  
        this.groupedProducts = products.reduce((acc, produit) => {
          if (!acc[produit.sousCategoryId]) {
            acc[produit.sousCategoryId] = [];
            this.currentIndex[produit.sousCategoryId] = 0;
          }
          acc[produit.sousCategoryId].push(produit);
          return acc;
        }, {} as { [key: string]: Produit[] });
      },
      (error) => {
        console.error('Erreur lors du chargement des sous-catégories :', error);
      }
    );
  }
  

  // groupProduitList() {
  //   const groups = [];
  //   for (let i = 0; i < this.products.length; i += 5) {
  //     groups.push(this.products.slice(i, i + 5));
  //   }
  //   return groups;
  // }
  getVisibleProducts(sousCategoryId: string): Produit[] {
    const currentIndex = this.currentIndex[sousCategoryId] || 0;
    const products = this.groupedProducts[sousCategoryId] || [];
    return products.slice(currentIndex, currentIndex + 5);
  }
  prevSlide(sousCategoryId: string): void {
    if (this.currentIndex[sousCategoryId] > 0) {
      this.currentIndex[sousCategoryId]--;
    }
  }

  nextSlide(sousCategoryId: string): void {
    const maxIndex =
      (this.groupedProducts[sousCategoryId]?.length || 0) - 5;
    if (this.currentIndex[sousCategoryId] < maxIndex) {
      this.currentIndex[sousCategoryId]++;
    }
  }
}
