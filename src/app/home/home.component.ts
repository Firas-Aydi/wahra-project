import { Component, HostListener, OnInit } from '@angular/core';
import { SousCategorieService } from '../services/sous-categorie.service';
import { ProductService } from '../services/produit.service';
import { SousCategorie } from '../model/sous-categorie';
import { Produit } from '../model/produit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sousCategories: SousCategorie[] = [];
  // produitsParSousCategorie: SousCategorie[] = [];
  groupedProducts: { [key: string]: Produit[] } = {};
  currentIndex: { [key: string]: number } = {};
  visibleProducts = 5;

  constructor(
    private sousCategorieService: SousCategorieService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSousCategoriesWithProducts();
    this.updateVisibleProducts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateVisibleProducts();
  }

  updateVisibleProducts(): void {
    const width = window.innerWidth;
    if (width <= 576) {
      this.visibleProducts = 1; // 1 produit par ligne sur mobile
    } else if (width <= 768) {
      this.visibleProducts = 2; // 2 produits par ligne sur petite tablette
    } else if (width <= 992) {
      this.visibleProducts = 3; // 3 produits par ligne sur tablette
    } else if (width <= 1200) {
      this.visibleProducts = 4; // 4 produits par ligne sur grand écran
    } else {
      this.visibleProducts = 5; // 5 produits par ligne sur bureau
    }
  }
  

  loadSousCategoriesWithProducts(): void {
    this.sousCategorieService.getSousCategories().subscribe((sousCategories) => {
      this.sousCategories = sousCategories;

      sousCategories.forEach((sousCategorie) => {
        this.productService
          .getProductsBySousCategorie(sousCategorie.id)
          .subscribe((produits) => {
            if (!this.groupedProducts[sousCategorie.id]) {
              this.groupedProducts[sousCategorie.id] = [];
              this.currentIndex[sousCategorie.id] = 0;
            }

            this.groupedProducts[sousCategorie.id] = produits;
            // this.produitsParSousCategorie.push(sousCategorie);
          });
      });
    });
  }

  getVisibleProducts(sousCategoryId: string): Produit[] {
    const currentIndex = this.currentIndex[sousCategoryId] || 0;
    const products = this.groupedProducts[sousCategoryId] || [];
    return products.slice(currentIndex, currentIndex + this.visibleProducts);
  }

  prevSlide(sousCategoryId: string): void {
    if (this.currentIndex[sousCategoryId] > 0) {
      this.currentIndex[sousCategoryId]--;
    }
  }

  nextSlide(sousCategoryId: string): void {
    const maxIndex =
      (this.groupedProducts[sousCategoryId]?.length || 0) -
      this.visibleProducts;
    if (this.currentIndex[sousCategoryId] < maxIndex) {
      this.currentIndex[sousCategoryId]++;
    }
  }

  viewProductDetails(produitId: string | undefined): void {
    if (produitId) {
      this.router.navigate(['/products', produitId]);
    } else {
      console.error(
        'Produit ID is undefined. Cannot navigate to produit details.'
      );
    }
  }
  scrollToSection(): void {
    // Descend la page de manière douce jusqu'à une section spécifique
    const targetElement = document.getElementById('scroll'); // ID de la section cible
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
