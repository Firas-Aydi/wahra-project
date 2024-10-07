import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AmbreService } from '../services/ambre.service';
import { Ambre } from '../model/ambre';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ambre',
  templateUrl: './manageAmbre.component.html',
  styleUrls: ['./manageAmbre.component.css'],
})
export class manageAmbreComponent implements OnInit {
  ambreList: Ambre[] = [];
  ambreObj: Ambre = {
    id: '',
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    // category: '',
    stock: 0,
    // tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    // ratings: 0,
    // reviewsCount: 0,
    // discount: 0,
    // isFeatured: false,
  };
  id: string = '';
  name: string = '';
  price: number = 0;
  description: string = '';
  // category: string = '';
  stock: number = 0;
  // tags: string[] = [];
  // ratings: number = 0;
  // reviewsCount: number = 0;
  // discount: number = 0;
  // isFeatured: boolean = false;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  image: string = '';

  // Error messages
  errorMessages: { [key: string]: string } = {
    name: '',
    price: '',
    description: '',
    stock: '',
    // discount: '',
    image: '',
  };

  constructor(private amb: AmbreService, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.getAllAmbre();
  }

  // Handle image file selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getAllAmbre() {
    this.amb.getAllAmbre().subscribe(
      (res) => {
        this.ambreList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          console.log('Fetched Ambre ID:', data.id); // Log the ID

          return data;
        });
      },
      (err) => {
        console.log('Error while fetching Ambre data: ', err);
        // alert('Error while fetching Ambre data');
      }
    );
  }

  resetForm() {
    this.id = '';
    this.name = '';
    this.price = 0;
    this.description = '';
    // this.category = '';
    this.stock = 0;
    // this.tags = [];
    // this.ratings = 0;
    // this.reviewsCount = 0;
    // this.discount = 0;
    // this.isFeatured = false;
    this.selectedImage = null;
    this.imagePreview = null;

    // Reset error messages
    this.errorMessages = {
      name: '',
      price: '',
      description: '',
      stock: '',
      image: '',
    };
  }

  // Validate form inputs
  validateForm() {
    // Reset error messages
    this.errorMessages['name'] = '';
    this.errorMessages['price'] = '';
    this.errorMessages['description'] = '';
    this.errorMessages['stock'] = '';
    this.errorMessages['image'] = '';

    // Validation checks
    if (this.name === '') {
      this.errorMessages['name'] = 'Name is required.';
    }

    if (this.price <= 0) {
      this.errorMessages['price'] = 'Price must be greater than zero.';
    }

    if (this.description === '') {
      this.errorMessages['description'] = 'Description is required.';
    }

    if (this.stock < 0) {
      this.errorMessages['stock'] = 'Stock cannot be negative.';
    }

    if (!this.selectedImage && !this.imagePreview) {
      this.errorMessages['image'] = 'Image is required.';
    }

    // Return true if there are no error messages
    return !Object.values(this.errorMessages).some((msg) => msg !== '');
  }

  // Add new product with image upload
  addAmbre() {
    if (!this.validateForm()) {
      // Create a string with error messages for each invalid field
      let errorMessage = '';

      if (this.errorMessages['name']) {
        errorMessage += `Name Error: ${this.errorMessages['name']}<br>`;
      }
      if (this.errorMessages['price']) {
        errorMessage += `Price Error: ${this.errorMessages['price']}<br>`;
      }
      if (this.errorMessages['description']) {
        errorMessage += `Description Error: ${this.errorMessages['description']}<br>`;
      }
      if (this.errorMessages['stock']) {
        errorMessage += `Stock Error: ${this.errorMessages['stock']}<br>`;
      }
      if (this.errorMessages['image']) {
        errorMessage += `Image Error: ${this.errorMessages['image']}<br>`;
      }

      // Display the error message using a customized alert
      alert(errorMessage.replace(/<br>/g, '\n')); // To show new lines in the alert

      return;
    }

    // Upload image to Firebase Storage
    const filePath = `AmbreImages/${Date.now()}_${this.selectedImage?.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);

    // Get the download URL after upload completes
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.ambreObj.id = '';
            this.ambreObj.name = this.name;
            this.ambreObj.price = this.price;
            this.ambreObj.description = this.description;
            // this.ambreObj.category = this.category;
            this.ambreObj.stock = this.stock;
            // this.ambreObj.tags = this.tags;
            // this.ambreObj.ratings = this.ratings;
            // this.ambreObj.reviewsCount = this.reviewsCount;
            // this.ambreObj.discount = this.discount;
            // this.ambreObj.isFeatured = this.isFeatured;
            this.ambreObj.imageUrl = url; // Set the image URL
            this.ambreObj.createdAt = new Date();
            this.ambreObj.updatedAt = new Date();

            // Add product to Firestore
            this.amb.addAmbre(this.ambreObj).then(() => {
              this.resetForm();
            });
          });
        })
      )
      .subscribe();
  }

  updateAmbre() {
    console.log('id: ' + this.id);
  
    // Validate form fields and check for errors
    if (!this.validateForm()) {
      let errorMessage = '';
  
      if (this.errorMessages['name']) {
        errorMessage += `Name Error: ${this.errorMessages['name']}<br>`;
      }
      if (this.errorMessages['price']) {
        errorMessage += `Price Error: ${this.errorMessages['price']}<br>`;
      }
      if (this.errorMessages['description']) {
        errorMessage += `Description Error: ${this.errorMessages['description']}<br>`;
      }
      if (this.errorMessages['stock']) {
        errorMessage += `Stock Error: ${this.errorMessages['stock']}<br>`;
      }
      if (!this.errorMessages['image']) {
        errorMessage += `Image Error: ${this.errorMessages['image']}<br>`;
      }
  
      // Display the error message using a customized alert
      alert(errorMessage.replace(/<br>/g, '\n')); // To show new lines in the alert
      return;
    }
  
    if (!this.id) {
      alert('No Ambre selected for update.');
      return;
    }

    const updateData: Partial<Ambre> = {
      name: this.name,
      price: this.price,
      description: this.description,
      stock: this.stock,
      // discount: this.discount,
      updatedAt: new Date(),
    };

    // Check if a new image is selected
    if (this.selectedImage) {
      // Upload new image to Firebase Storage
      const filePath = `AmbreImages/${Date.now()}_${this.selectedImage?.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedImage);

      // Update image URL after image upload completes
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              updateData.imageUrl = url;

              // Update product with new data and image URL
              this.amb.updateAmbre(this.id, updateData).then(() => {
                this.resetForm();
                alert('Ambre updated successfully!');
              });
            });
          })
        )
        .subscribe();
    } else {
      // If no new image is selected, update the product without changing the image URL
      this.amb.updateAmbre(this.id, updateData).then(() => {
        this.resetForm();
        alert('Ambre updated successfully!');
      });
    }
  }

  editAmbre(amb: Ambre) {
    this.id = amb.id;
    this.name = amb.name;
    this.price = amb.price ?? 0;
    this.description = amb.description;
    this.stock = amb.stock ?? 0;
    // this.discount = amb.discount ?? 0;
    this.imagePreview = amb.imageUrl || ''; // Show the current image
  }

  deleteAmbre(amb: Ambre) {
    if (window.confirm('Are you sure you want to delete ' + amb.name + ' ?')) {
      this.amb.deleteAmbre(amb);
    }
  }
}
