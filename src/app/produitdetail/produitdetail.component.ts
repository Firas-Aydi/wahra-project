import { Component } from '@angular/core';
import { Produit } from '../model/produit';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/produit.service';
import { PierreService } from '../services/pierre.service';
import { Pierre } from '../model/pierre';

@Component({
  selector: 'app-produitdetail',
  templateUrl: './produitdetail.component.html',
  styleUrls: ['./produitdetail.component.css']
})
export class ProduitdetailComponent {
  produit: Produit | null = null;
  pierre: Pierre | null = null; // Détails de la pierre associée
  selectedImage: string = '';
  quantity: number = 1;
  quantityError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProductService,
    private pierreService: PierreService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const produitId = this.route.snapshot.paramMap.get('id');
    this.loadProduitDetails(produitId);
  }

  loadProduitDetails(produitId: string | null) {
    if (produitId) {
      this.produitService.getProduitById(produitId).subscribe(
        (data) => {
          if (data) {
            this.produit = data;
            this.selectedImage = this.produit.images[0];
            if (this.produit.pierreId) {
              this.loadPierreDetails(this.produit.pierreId);
            }
          } else {
            console.error('Aucun produit trouvé avec cet ID.');
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération du produit :', error);
        }
      );
    } else {
      console.error('ID du produit non valide.');
    }
  }

  loadPierreDetails(pierreId: string) {
    this.pierreService.getPierreById(pierreId).subscribe(
      (data) => {
        if (data) {
          this.pierre = data;
        } else {
          console.error('Aucune pierre trouvée avec cet ID.');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la pierre :', error);
      }
    );
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  addToCart(produit: Produit, quantity: number) {
    if (produit && quantity > 0) {
      this.cartService.addToCart(produit, quantity);
      alert(`${quantity} ${produit.name}(s) ajoutée(s) au panier !`);
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null;
    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être au moins de 1.';
    } else if (this.quantity > (this.produit?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser le stock disponible (${this.produit?.stock}).`;
    }
  }
}
