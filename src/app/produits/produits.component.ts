import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  categorieId: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    
    // Écouter les changements de paramètres dans l'URL
    this.route.paramMap.subscribe((params) => {
      this.sousCategorieId = params.get('sousCategorieId') || '';
      this.pierreId = params.get('pierreId') || '';
      this.categorieId = params.get('categorieId') || '';
      
      if (this.sousCategorieId) {
        this.loadProductsBySousCategorie(this.sousCategorieId);
      } else if (this.pierreId) {
        this.loadProductsByPierre(this.pierreId);
      
      }
    });
    
  }

  loadProductsBySousCategorie(sousCategorieId: string): void {
    this.isLoading = true;
    this.productService.getProductsBySousCategorie(sousCategorieId).subscribe(
      (products) => {
        this.products = products;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
        this.isLoading = false;
      }
    );
  }
  loadProductsByPierre(pierreId: string): void {
    this.isLoading = true;
    this.productService.getProductsByPierre(pierreId).subscribe(
      (products) => {
        this.products = products;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
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
