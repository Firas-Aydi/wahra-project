import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service'; // Assuming you have a CartService
// import { Ambre } from '../model/ambre';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  allCartItems: any[] = [];
  totalPrice: number = 0;
  quantityErrors: { [itemId: string]: string } = {};

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Load the cart items from the CartService
  loadCartItems() {
    this.allCartItems = this.cartService.getCartItems();
    console.log('allCartItems:', this.allCartItems);
    this.calculateTotalPrice();
  }

  // Calculate the total price
  calculateTotalPrice() {
    this.totalPrice = this.allCartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0);
  }

  // Update quantity and handle stock checks
  updateQuantity(cartItem: any, quantity: number) {
    const stock = cartItem.product.stock || 0;
    const itemId = cartItem.product.id;
    console.log('itemId:', itemId)
    if (quantity < 1) {
      this.quantityErrors[itemId] = "La quantité doit être d'au moins 1.";
    } else if (quantity > stock) {
      this.quantityErrors[
        itemId
      ] = `La quantité ne peut pas dépasser la limite de stock de ${stock}.`;
    } else {
      this.quantityErrors[itemId] = '';
      cartItem.quantity = quantity;
      this.cartService.updateCartItem(itemId, quantity); // Update in CartService
      this.calculateTotalPrice(); // Recalculate the total price
    }
  }

  // Remove an item from the cart
  removeItem(productId: string) {
    this.cartService.removeCartItem(productId);
    this.loadCartItems(); // Reload the cart items after removal
    this.calculateTotalPrice(); // Recalculate total price
  }

  // Proceed to checkout
  proceedToCheckout() {
    this.router.navigate(['/commande']);
    console.log('Proceeding to checkout with total price: ', this.totalPrice);
  }
}
