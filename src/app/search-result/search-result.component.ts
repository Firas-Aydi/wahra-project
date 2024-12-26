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
