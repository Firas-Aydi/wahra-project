// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Produit } from '../model/produit';
// import { Pierre } from '../model/pierre';
// import { Categorie } from '../model/categorie';
// import { SousCategorie } from '../model/sous-categorie';
// import { ProductService } from '../services/produit.service';
// import { PierreService } from '../services/pierre.service';
// import { CategorieService } from '../services/categorie.service';
// import { SousCategorieService } from '../services/sous-categorie.service';

// @Component({
//   selector: 'app-search-result',
//   templateUrl: './search-result.component.html',
//   styleUrls: ['./search-result.component.css'],
// })
// export class SearchResultComponent {
//   produits: Produit[] = [];
//   isLoading: boolean = false;

//   constructor(
//     private categorieService: CategorieService,
//     private sousCategorieService: SousCategorieService,
//     private pierreService: PierreService,
//     private productService: ProductService
//   ) {}

//   search(term: string): void {
//     if (!term || term.trim() === '') return;

//     this.isLoading = true;
//     const searchTerm = term.trim().toLowerCase();
//     this.produits = [];

//     // Étape 1 : Chercher dans les catégories
//     this.categorieService.getCategories().subscribe((categories) => {
//       const matchingCategories = categories.filter((cat) =>
//         cat.name.toLowerCase().includes(searchTerm)
//       );

//       if (matchingCategories.length > 0) {
//         const categoryIds = matchingCategories.map((cat) => cat.id);

//         // Trouver les sous-catégories et les pierres de ces catégories
//         this.sousCategorieService.getSousCategoriesByIds(categoryIds).subscribe((subCategories) => {
//           const subCategoryIds = subCategories.map((sc) => sc.id);

//           this.sousCategorieService.getPierresByIds(categoryIds).subscribe((pierres) => {
//             const pierreIds = pierres.map((p) => p.id);

//             // Rechercher les produits correspondants
//             this.getProductsBySubCategoryAndPierre(subCategoryIds, pierreIds);
//           });
//         });
//       }
//     });

//     // Étape 2 : Chercher dans les sous-catégories
//     this.sousCategorieService.getSousCategories().subscribe((subCategories) => {
//       const matchingSubCategories = subCategories.filter((subCat) =>
//         subCat.name.toLowerCase().includes(searchTerm)
//       );

//       if (matchingSubCategories.length > 0) {
//         const subCategoryIds = matchingSubCategories.map((sc) => sc.id);

//         this.getProductsBySubCategory(subCategoryIds);
//       }
//     });

//     // Étape 3 : Chercher dans les pierres
//     this.pierreService.getPierres().subscribe((pierres) => {
//       const matchingPierres = pierres.filter((p) =>
//         p.name.toLowerCase().includes(searchTerm)
//       );

//       if (matchingPierres.length > 0) {
//         const pierreIds = matchingPierres.map((p) => p.id);

//         this.getProductsByPierre(pierreIds);
//       }
//     });

//     // Étape 4 : Chercher directement dans les produits
//     this.productService.getProduits().subscribe((produits) => {
//       const matchingProduits = produits.filter((prod) =>
//         prod.name.toLowerCase().includes(searchTerm)
//       );

//       this.produits = [...this.produits, ...matchingProduits];
//       this.isLoading = false;
//     });
//   }

//   private getProductsBySubCategoryAndPierre(subCategoryIds: string[], pierreIds: string[]): void {
//     this.productService.getProduits().subscribe((produits) => {
//       const filteredProduits = produits.filter(
//         (prod) =>
//           (prod.sousCategoryId && subCategoryIds.includes(prod.sousCategoryId)) ||
//           (prod.pierreId && pierreIds.includes(prod.pierreId))
//       );

//       this.produits = [...this.produits, ...filteredProduits];
//       this.isLoading = false;
//     });
//   }

//   private getProductsBySubCategory(subCategoryIds: string[]): void {
//     this.productService.getProduits().subscribe((produits) => {
//       const filteredProduits = produits.filter((prod) =>
//         subCategoryIds.includes(prod.sousCategoryId)
//       );

//       this.produits = [...this.produits, ...filteredProduits];
//       this.isLoading = false;
//     });
//   }

//   private getProductsByPierre(pierreIds: string[]): void {
//     this.productService.getProduits().subscribe((produits) => {
//       const filteredProduits = produits.filter((prod) =>
//         prod.pierreId && pierreIds.includes(prod.pierreId)
//       );

//       this.produits = [...this.produits, ...filteredProduits];
//       this.isLoading = false;
//     });
//   }
// }


import { Component } from '@angular/core';
import { SearchService } from '../services/search-result.service';
import { Produit } from '../model/produit';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent {
  produits: Produit[] = [];
  isLoading: boolean = false;

  constructor(private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const term = params['term'];  // Assurez-vous que le paramètre est bien 'term' dans l'URL
      if (term) {
        this.search(term);
      }
    });
  }

  search(term: string): void {
    console.log('term: ', term)
    if (!term.trim()) return;

    this.isLoading = true;
    this.searchService.search(term).subscribe(
      produits => {
        this.produits = produits;
        this.isLoading = false;
      },
      () => {
        this.produits = [];
        this.isLoading = false;
      }
    );
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
