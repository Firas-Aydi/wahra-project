import { Component } from '@angular/core';
import { Produit } from '../model/produit';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/produit.service';

@Component({
  selector: 'app-produitdetail',
  templateUrl: './produitdetail.component.html',
  styleUrls: ['./produitdetail.component.css']
})
export class ProduitdetailComponent {

  produit: Produit | null = null; // Pour stocker les détails de la produit
  selectedImage: string = '';
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private produitService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const produitId = this.route.snapshot.paramMap.get('id');
    this.loadProduitDetails(produitId);
    console.log('produitId: ', produitId);
  }
  
  loadProduitDetails(produitId: string | null) {
    if (produitId) {
      this.produitService.getProduitById(produitId).subscribe(
        (data) => {
          if (data) {
            this.produit = data;
            console.log('Détails du produit :', this.produit);
            this.selectedImage = this.produit.images[0]; // Image par défaut
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
  
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(produit: Produit, quantity: number) {
    // Check if the produit and quantity are valid
    if (produit && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${produit.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(produit, quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${produit.name}(s) ajoutée(s) au panier !`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > produit.stock) {
      // Handle case where the quantity exceeds the stock
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Handle other invalid cases, like if the produit object is null
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être au moins de 1.';
    } else if (this.quantity > (this.produit?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.produit?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
