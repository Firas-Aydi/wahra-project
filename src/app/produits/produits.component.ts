import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/produit.service';
import { Produit } from '../model/produit';

@Component({
  selector: 'app-products',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit {
  products: Produit[] = [];
  pierreId: string = '';
  sousCategorieId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    
    // Écouter les changements de paramètres dans l'URL
    this.route.paramMap.subscribe((params) => {
      this.sousCategorieId = params.get('sousCategorieId') || '';
      this.pierreId = params.get('pierreId') || '';
      
      if (this.sousCategorieId) {
        this.loadProductsBySousCategorie(this.sousCategorieId);
      } else if (this.pierreId) {
        this.loadProductsByPierre(this.pierreId);
      }
    });
    
  }

  loadProductsBySousCategorie(sousCategorieId: string): void {
    this.productService.getProductsBySousCategorie(sousCategorieId).subscribe(
      (products) => {
        this.products = products;
        console.log('Produits chargés pour la sousCategorie :', this.products);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
  loadProductsByPierre(pierreId: string): void {
    this.productService.getProductsByPierre(pierreId).subscribe(
      (products) => {
        this.products = products;
        console.log('Produits chargés pour la pierre :', this.products);
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
}
