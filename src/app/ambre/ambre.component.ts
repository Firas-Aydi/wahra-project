import { Component } from '@angular/core';
import { AmbreService } from '../services/ambre.service';
import { Ambre } from '../model/ambre';
declare var bootstrap: any;

@Component({
  selector: 'app-ambre',
  templateUrl: './ambre.component.html',
  styleUrls: ['./ambre.component.css']
})
export class AmbreComponent {
  ambreList: Ambre[] = [];
  modalDescription: string = '';
  selectedAmbre: Ambre | null = null;
  quantity: number = 1;  // Default quantity
  quantityError: string | null = null;

  constructor(private amb: AmbreService) {}

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
    const productDetailsModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
    productDetailsModal.show();
  }

  groupAmbreList() {
    const groups = [];
    for (let i = 0; i < this.ambreList.length; i += 3) {
      groups.push(this.ambreList.slice(i, i + 3));
    }
    return groups;
  }
  addToCart(ambre: Ambre, quantity: number) {
    if (ambre && quantity > 0) {
        // Implement your logic to add the item to the cart
        console.log(`Added ${quantity} of ${ambre.name} to the cart.`);
        // Example: this.cartService.addToCart(ambre, quantity);
    }
}
validateQuantity() {
  this.quantityError = null;  // Reset error message

  if (this.quantity < 1) {
    this.quantityError = 'Quantity must be at least 1.';
  } else if (this.quantity > (this.selectedAmbre?.stock || 0)) {
    this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedAmbre?.stock}.`;
  } else if (this.quantity === null || this.quantity === undefined || this.quantity === 0) {
    this.quantityError = 'Quantity cannot be empty.';
  }
}
}
