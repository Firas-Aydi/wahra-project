import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service'; // Assuming you have a CartService
import { Ambre } from '../model/ambre'; // Assuming you're using the Ambre model for products

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { product: Ambre, quantity: number }[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotalPrice();
  }

  // Load the cart items from the CartService
  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
  }

  // Calculate the total price
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  // Update the quantity of a product in the cart
  updateQuantity(item: { product: Ambre, quantity: number }, quantity: number) {
    if (quantity > 0 && quantity <= item.product.stock) {
      item.quantity = quantity;
      this.cartService.updateCartItem(item.product.id, quantity); // Update in CartService
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
    // Implement checkout logic
    console.log('Proceeding to checkout with total price: ', this.totalPrice);
  }
}
