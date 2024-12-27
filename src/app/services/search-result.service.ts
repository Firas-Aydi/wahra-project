import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
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

    if (!cleanTerm) {
      return of([]); // Si le terme est vide, renvoyer un tableau vide
    }

    const categories$ = this.categorieService.getCategories().pipe(
      map(categories => categories.filter(c => c.name.toLowerCase().includes(cleanTerm))),
      catchError(() => of([])) // Gestion des erreurs
    );

    const sousCategories$ = this.sousCategorieService.getSousCategories().pipe(
      map(sousCategories => sousCategories.filter(sc => sc.name.toLowerCase().includes(cleanTerm))),
      catchError(() => of([]))
    );

    const pierres$ = this.pierreService.getPierres().pipe(
      map(pierres => pierres.filter(p => p.name.toLowerCase().includes(cleanTerm))),
      catchError(() => of([]))
    );

    const produitsDirects$ = this.productService.getProduits().pipe(
      map(produits => produits.filter(p => p.name.toLowerCase().includes(cleanTerm))),
      catchError(() => of([]))
    );

    return combineLatest([categories$, sousCategories$, pierres$, produitsDirects$]).pipe(
      switchMap(([categories, sousCategories, pierres, produitsDirects]) => {
        const sousCategoryIds = sousCategories.map(sc => sc.id);
        const pierreIds = pierres.map(p => p.id);
        console.log('sousCategoryIds: ', sousCategoryIds)
        console.log('pierreIds: ', pierreIds)
        console.log('produitsDirects: ', produitsDirects)
        return this.productService.getProduits().pipe(
          map(allProduits => {
            console.log('allProduits:', allProduits)
            const produitsLiees = allProduits
            .filter(
              prod =>
                (prod.sousCategoryId && sousCategoryIds.includes(prod.sousCategoryId)) ||
              (prod.pierreId && prod.pierreId.some(id => pierreIds.includes(id)))
            );
                console.log('produitsLiees:', produitsLiees);

            // Combiner les produits trouvés directement et ceux liés
            const resultatFinal = [...produitsDirects, ...produitsLiees];
            console.log('Résultat final combiné:', resultatFinal);
 
            // Supprimer les doublons basés sur l'ID
            return resultatFinal.filter(
              (prod, index, self) => self.findIndex(p => p.id === prod.id) === index
            );
          }),
          catchError(() => of([]))
        );
      }),
      catchError(() => of([])) // Gestion des erreurs globales
    );
  }
}
