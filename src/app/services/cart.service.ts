import { Injectable } from '@angular/core';
import { Ambre } from '../model/ambre';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { ambre: Ambre, quantity: number }[] = [];

  addToCart(ambre: Ambre, quantity: number) {
    const existingItem = this.cart.find(item => item.ambre.id === ambre.id);
    if (existingItem) {
      // Update quantity if the item is already in the cart
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      this.cart.push({ ambre, quantity });
    }
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
  }
}
