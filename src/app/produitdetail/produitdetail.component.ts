import { Component } from '@angular/core';
import { Produit } from '../model/produit';
import { ActivatedRoute, Router } from '@angular/router';
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
  pierres: Pierre[] = []; // Détails de la pierre associée
  pierresUniques: Map<string, Pierre> = new Map();

  selectedImage: string = '';
  quantity: number = 1;
  quantityError: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private produitService: ProductService,
    private pierreService: PierreService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const produitId = this.route.snapshot.paramMap.get('id');
    this.loadProduitDetails(produitId);
    // this.pierres = Array.from(this.pierresUniques.values()); 
  }

  loadProduitDetails(produitId: string | null) {
    if (produitId) {
      this.produitService.getProduitById(produitId).subscribe(
        (data) => {
          if (data) {
            this.produit = data;
            this.selectedImage = this.produit.images[0];
            if (this.produit.pierreId && this.produit.pierreId.length > 0) {
              this.loadPierresDetails(this.produit.pierreId);
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

  loadPierresDetails(pierreIds: string[]) {
    const fetchedPierreIds = new Set<string>();

    pierreIds.forEach((id) => {
      if (!fetchedPierreIds.has(id)) {
        fetchedPierreIds.add(id);
        this.pierreService.getPierreById(id).subscribe(
          (data) => {
            if (data) {
              this.pierresUniques.set(data.id, data); // Add to Map
            } else {
              console.warn(`Aucune pierre trouvée avec l'ID : ${id}`);
            }
          },
          (error) => {
            console.error(`Erreur lors de la récupération de la pierre (ID: ${id}) :`, error);
          }
        );
      }
    });
    console.log('this.pierresUniques: ', this.pierresUniques)
    // Convert Map values to an array for easier use in the template
    // this.pierres = Array.from(this.pierresUniques.values()); 
    // console.log('this.pierres: ',this.pierres)
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  addToCart(produit: Produit, quantity: number) {
    if (produit && quantity > 0) {
      this.cartService.addToCart(produit, quantity);
      alert(`${quantity} ${produit.name}(s) ajoutée(s) au panier !`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > produit.stock) {
      // Handle case where the quantity exceeds the stock
      alert('La quantité entrée dépasse le stock disponible.');
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
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
  viewPierreDetails(pierreId: string): void {
    this.router.navigate(['/pierredetail', pierreId]);
  }
}
