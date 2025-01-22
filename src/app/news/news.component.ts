import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { ProductService } from '../services/produit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  nouveautes: Produit[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService, private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchNouveautes();
  }

  fetchNouveautes(): void {
    this.productService.getNouveautes().subscribe({
      next: (products) => {
        this.nouveautes = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des nouveautés :', err);
        this.isLoading = false;
      }
    });
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
