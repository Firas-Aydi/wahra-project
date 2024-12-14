import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmbreService } from '../services/ambre.service';
import { Ambre } from '../model/ambre';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-ambrdetail',
  templateUrl: './ambrdetail.component.html',
  styleUrls: ['./ambrdetail.component.css']
})
export class AmbrdetailComponent implements OnInit {
  ambre: Ambre | null = null; // Pour stocker les détails de la ambre
  selectedImage: string = '';
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private ambreService: AmbreService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const ambreId = this.route.snapshot.paramMap.get('id');
    this.loadAmbreDetails(ambreId);
    console.log('ambreId: ', ambreId);
  }
  
  loadAmbreDetails(ambreId: string | null) {
    if (ambreId) {
      this.ambreService.getAmbreById(ambreId).subscribe(
        (data) => {
          if (data) {
            this.ambre = data;
            console.log('Détails de l’ambre :', this.ambre);
            this.selectedImage = this.ambre.images[0]; // Image par défaut
          } else {
            console.error('Aucun ambre trouvé avec cet ID.');
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération de l’ambre :', error);
        }
      );
    } else {
      console.error('ID de l’ambre non valide.');
    }
  }
  
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(ambre: Ambre, quantity: number) {
    // Check if the ambre and quantity are valid
    if (ambre && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${ambre.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(ambre, quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${ambre.name}(s) ajoutée(s) au panier !`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > ambre.stock) {
      // Handle case where the quantity exceeds the stock
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Handle other invalid cases, like if the ambre object is null
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être au moins de 1.';
    } else if (this.quantity > (this.ambre?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.ambre?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
