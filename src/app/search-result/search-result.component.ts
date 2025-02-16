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
  term = ''

  constructor(
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const term = params['term'];
      if (term) {
        this.term = term
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
        console.log('Produits trouvés :', this.produits);
      },
      error => {
        console.error('Erreur lors de la recherche :', error);
        this.produits = [];
        this.isLoading = false;
      }
    );
  }

  viewProductDetails(produitId: string | undefined): void {
    if (produitId) {
      this.router.navigate(['/products', produitId]);
    } else {
      console.error('Produit ID est indéfini. Impossible de naviguer vers les détails.');
    }
  }
}
