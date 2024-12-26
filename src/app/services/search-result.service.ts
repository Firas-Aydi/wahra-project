import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// import { Categorie } from '../model/categorie';
// import { SousCategorie } from '../model/sous-categorie';
// import { Pierre } from '../model/pierre';
import { Produit } from '../model/produit';
import { CategorieService } from './categorie.service';
import { SousCategorieService } from './sous-categorie.service';
import { PierreService } from './pierre.service';
import { ProductService } from './produit.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private categorieService: CategorieService,
    private sousCategorieService: SousCategorieService,
    private pierreService: PierreService,
    private productService: ProductService
  ) { }

  search(term: string): Observable<Produit[]> {
    const cleanTerm = term.trim().toLowerCase();

    const categories$ = this.categorieService.getCategories().pipe(
      map(categories => categories.filter(c => c.name.toLowerCase().includes(cleanTerm)))
    );

    const sousCategories$ = this.sousCategorieService.getSousCategories().pipe(
      map(sousCategories => sousCategories.filter(sc => sc.name.toLowerCase().includes(cleanTerm)))
    );

    const pierres$ = this.pierreService.getPierres().pipe(
      map(pierres => pierres.filter(p => p.name.toLowerCase().includes(cleanTerm)))
    );

    const produits$ = this.productService.getProduits().pipe(
      map(produits => produits.filter(p => p.name.toLowerCase().includes(cleanTerm)))
    );

    return combineLatest([categories$, sousCategories$, pierres$, produits$]).pipe(
      switchMap(([categories, sousCategories, pierres, produits]) => {
        if (produits.length > 0) {
          return of(produits);
        }

        // const categoryIds = categories.map(c => c.id);
        const sousCategoryIds = sousCategories.map(sc => sc.id);
        const pierreIds = pierres.map(p => p.id);

        return this.productService.getProduits().pipe(
          map(allProduits =>
            allProduits.filter(
              prod =>
                (prod.sousCategoryId && sousCategoryIds.includes(prod.sousCategoryId)) ||
                (prod.pierreId && pierreIds.some(pierreId => pierreIds.includes(pierreId)))
          )
        ));
      })
    );
  }
}
