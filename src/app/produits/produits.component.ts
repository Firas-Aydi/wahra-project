import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/produit.service';

@Component({
  selector: 'app-products',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit {
  products: any[] = [];
  sousCategorieId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Écouter les changements de paramètres dans l'URL
    this.route.paramMap.subscribe((params) => {
      this.sousCategorieId = params.get('id') || '';
      console.log('Paramètre sousCategorieId changé :', this.sousCategorieId);
      if (this.sousCategorieId) {
        this.loadProducts(this.sousCategorieId);
      }
    });
  }

  loadProducts(sousCategorieId: string): void {
    this.productService.getProductsBySousCategorie(sousCategorieId).subscribe(
      (products) => {
        this.products = products;
        console.log('Produits chargés :', this.products);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
}
