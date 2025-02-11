import { Component, HostListener, OnInit } from '@angular/core';
import { SousCategorieService } from '../services/sous-categorie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../model/produit';

@Component({
  selector: 'app-sous-categories',
  templateUrl: './sous-categories.component.html',
  styleUrls: ['./sous-categories.component.css'],
})
export class SousCategoriesComponent implements OnInit {
  produitParPierre: Produit[] = [];
  categorieId: string = '';
  pierreCurrentIndex: number = 0;
  visibleProducts: number = 4;

  groupedProducts: { [key: string]: Produit[] } = {};
  sousCategories: { id: string; name: string }[] = [];
  currentIndex: { [key: string]: number } = {};
  carouselIndexes: { [key: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sousCategorieService: SousCategorieService
  ) { }

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
      this.visibleProducts = 4; // 5 produits par ligne sur bureau
    }
  }


  loadProductsByCategorySousCategorie(categoryId: string): void {
    this.sousCategorieService
      .getProductsByCategorySousCategorie(categoryId)
      .subscribe(
        (products) => {
          this.groupProductsBySousCategorie(products);
        },
        (error) => {
          console.error('Erreur lors du chargement des produits :', error);
        }
      );
  }
  loadProductsByCategoryPierre(categoryId: string): void {
    this.sousCategorieService.getProductsByCategoryPierre(categoryId).subscribe(
      (products) => {
        this.produitParPierre = products;
        this.groupProductsByPierre(products);
        // console.log('Produits chargés pour produitParPierre :',this.produitParPierre);
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
  groupProductsByPierre(products: Produit[]): void {
    const pierreIds = Array.from(
      new Set(products.flatMap((produit) => produit.pierreId || []))
    );
  
    this.sousCategorieService.getPierresByIds(pierreIds).subscribe(
      (pierres) => {
        const pierreMap = pierres.reduce((acc: { [key: string]: string }, pierre) => {
          acc[pierre.id] = pierre.name;
          return acc;
        }, {});
  
        // Regrouper les produits par nom de pierre
        this.groupedProducts = products.reduce((acc, produit) => {
          const pierreNames = produit.pierreId?.map((id) => pierreMap[id]) || ['Inconnue'];
          pierreNames.forEach((pierreName) => {
            if (!acc[pierreName]) {
              acc[pierreName] = [];
            }
            acc[pierreName].push(produit);
          });
          return acc;
        }, {} as { [key: string]: Produit[] });
  
        // Initialiser les index pour chaque pierre
        Object.keys(this.groupedProducts).forEach((pierreName) => {
          this.carouselIndexes[pierreName] = 0;
        });
  
        console.log('Grouped products by Pierre:', this.groupedProducts);
      },
      (error) => {
        console.error('Erreur lors du chargement des pierres :', error);
      }
    );
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
    const maxIndex = (this.groupedProducts[sousCategoryId]?.length || 0) - this.visibleProducts;
    if (this.currentIndex[sousCategoryId] < maxIndex) {
      this.currentIndex[sousCategoryId]++;
    }
  }
  // Boutons de navigation pour les produits par pierre
  prevSlideForPierre(pierreId: string): void {
    if (this.carouselIndexes[pierreId] > 0) {
      this.carouselIndexes[pierreId]--;
    }
  }

  nextSlideForPierre(pierreId: string): void {
    const maxIndex = (this.groupedProducts[pierreId]?.length || 0) - this.visibleProducts;
    if (this.carouselIndexes[pierreId] < maxIndex) {
      this.carouselIndexes[pierreId]++;
    }
  }

  getVisibleProductsForPierre(pierreId: string): Produit[] {
    // console.log('groupedProducts: ',this.groupedProducts)
    // console.log('groupedProducts[pierreId]: ',this.groupedProducts[pierreId])
    // console.log('groupedProducts[pierreId][0].id: ',this.groupedProducts[pierreId][0].id)
    const currentIndex = this.carouselIndexes[pierreId] || 0;
    const products = this.groupedProducts[pierreId] || [];
    return products.slice(currentIndex, currentIndex + this.visibleProducts);
  }

  viewProductDetails(produitId: string | undefined) {
    if (produitId) {
      this.router.navigate(['/products', produitId]);
    } else {
      console.error(
        'produit ID is undefined. Cannot navigate to produit details.'
      );
    }
  }
}
