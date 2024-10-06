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
        alert('Error while fetching Ambre data');
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
}
