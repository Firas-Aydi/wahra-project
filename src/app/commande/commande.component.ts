import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Commande } from '../model/commande';
import { CommandeService } from '../services/commande.service';
@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {

  commande: Commande = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    codePostal: '',
    email: '',
    phone: '',
    notes: '',
    etat: 'en attente' // État par défaut
  };

  cartItems: any[] = []; // Pour stocker les articles du panier
  totalPrice: number = 0; // Pour calculer le total
  deliveryPrice: number = 0;

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService, // Inject CommandeService
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  updateDeliveryPrice() {
    this.calculateTotalPrice(); // Recalcule le total incluant la livraison
  }

  // Calcule le total des articles du panier avec le prix de livraison
  calculateTotalPrice() {
    const cartTotal = this.cartItems.reduce(
      (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
      0
    );
    this.totalPrice = cartTotal + this.deliveryPrice;
  }

  onSubmit() {
    this.commandeService
      .saveOrder(this.commande, this.cartItems, this.totalPrice)
      .then(() => {
        window.alert('Commande envoyée avec succès!');
        // this.router.navigate(['/confirmation']); 
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'enregistrement de la commande :",
          error
        );
      });
    // console.log('Commande soumise:', this.commande);
    // console.log('Détails du panier:', this.cartItems);
  }
}
