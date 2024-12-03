import { Component } from '@angular/core';
import { AmbreService } from '../services/ambre.service';
import { Ambre } from '../model/ambre';
import { CartService } from '../services/cart.service';

declare var bootstrap: any;

@Component({
  selector: 'app-ambre',
  templateUrl: './ambre.component.html',
  styleUrls: ['./ambre.component.css'],
})
export class AmbreComponent {
  ambreList: Ambre[] = [];
  modalDescription: string = '';
  selectedAmbre: Ambre | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;

  constructor(private amb: AmbreService, private cartService: CartService) {}

  ngOnInit(): void {
    this.getAllAmbre();
  }

  getAllAmbre() {
    this.amb.getAllAmbre().subscribe(
      (res) => {
        this.ambreList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        console.log('Error while fetching Ambre data: ', err);
        // alert('Error while fetching Ambre data');
      }
    );
  }

  openProductDetailsModal(ambre: Ambre) {
    this.selectedAmbre = ambre;
    const productDetailsModal = new bootstrap.Modal(
      document.getElementById('productDetailsModal')
    );
    productDetailsModal.show();
  }

  groupAmbreList() {
    const groups = [];
    for (let i = 0; i < this.ambreList.length; i += 5) {
      groups.push(this.ambreList.slice(i, i + 5));
    }
    return groups;
  }
  addToCart(ambre: Ambre, quantity: number) {
    // Check if the product and quantity are valid
    if (ambre && quantity > 0 && quantity <= ambre.stock) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${ambre.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(ambre, quantity);

      // Optionally show a success message or notification
      // alert(`${quantity} ${ambre.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > ambre.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the ambre object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.selectedAmbre?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedAmbre?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
    }
  }
}
