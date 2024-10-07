import { Injectable } from '@angular/core';
import { Ambre } from '../model/ambre';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { product: Ambre, quantity: number }[] = [];

  constructor() {}

  // Add a product to the cart
  addToCart(product: Ambre, quantity: number) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
  }

  // Get all cart items
  getCartItems() {
    return this.cartItems;
  }

  // Update quantity of a specific product
  updateCartItem(productId: string, quantity: number) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Remove a product from the cart
  removeCartItem(productId: string) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
  }

  // Clear the cart after checkout
  clearCart() {
    this.cartItems = [];
  }
}
