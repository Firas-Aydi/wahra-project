import { Injectable } from '@angular/core';
// import { Ambre } from '../model/ambre';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { product: any, quantity: number }[] = [];
  cartItemCount$ = new Subject<number>();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  getTotalItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  private saveCartToLocalStorage() {
    localStorage.setItem('wahracartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('wahracartItemCount', this.getTotalItemsCount().toString());
  }
  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('wahracartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemCount$.next(this.getTotalItemsCount());
    }
  }

  // Add a product to the cart
  addToCart(product: any, quantity: number) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    this.cartItemCount$.next(this.getTotalItemsCount());
    this.saveCartToLocalStorage();
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
      this.saveCartToLocalStorage();
    }
  }

  // Remove a product from the cart
  removeCartItem(productId: string) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartItemCount$.next(this.getTotalItemsCount());
    this.saveCartToLocalStorage();
  }

  // Clear the cart after checkout
  clearCart() {
    this.cartItems = [];
  }
}
