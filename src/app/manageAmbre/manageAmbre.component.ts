import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbreService } from '../services/ambre.service';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ambre } from '../model/ambre';

@Component({
  selector: 'app-ambre',
  templateUrl: './manageAmbre.component.html',
  styleUrls: ['./manageAmbre.component.css'],
})
export class manageAmbreComponent implements OnInit {
  
  ambreForm: FormGroup;
  ambreList: Ambre[] = [];
  selectedImage: File | null = null;
  imagePreview: string[] = [];

  constructor(
    private fb: FormBuilder,
    private ambreService: AmbreService,
    // private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {
    // Initialisation du formulaire avec validation
    this.ambreForm = this.fb.group({
      id: [''], // Auto-généré si vide
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: [[]], // Tableau vide pour stocker les URLs des images
      createdAt: [new Date()],
      updatedAt: [new Date()],
    });
  }

  ngOnInit(): void {
    this.getAllAmbre();
  }

  generateUniqueId(): string {
    return this.firestore.createId();
  }
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const ambreId = this.ambreForm.value.ambreId || this.generateUniqueId(); // Utiliser un ID unique

    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Téléchargement de l'image dans Firebase Storage
      this.ambreService.uploadImage(file, ambreId).subscribe((imageUrl: string) => {
        console.log('Image téléchargée : ', imageUrl); // Log de l'URL
        imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement

        // Log de l'état du tableau images
        console.log('Array d\'images après ajout : ', imagesArray);

        this.ambreForm.patchValue({ images: imagesArray });
        this.ambreForm.get('images')?.updateValueAndValidity();
      });
    }
  }
  // Récupérer toutes les données Ambre
  getAllAmbre(): void {
    this.ambreService.getAllAmbre().subscribe(
      (res) => {
        this.ambreList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        console.error('Error while fetching Ambre data: ', err);
      }
    );
  }

  resetForm(): void {
    this.ambreForm.reset({
      id: '',
      name: '',
      price: 0,
      description: '',
      stock: 0,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.selectedImage = null;
    this.imagePreview = [];
  }

  // Add new product with image upload
  addAmbre(): void {
    if (this.ambreForm.valid) {
      const ambreData = { ...this.ambreForm.value, id: this.firestore.createId() };

      this.ambreService.addAmbre(ambreData).then(() => {
        this.resetForm();
        alert('Ambre added successfully!');
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  updateAmbre(): void {
    if (this.ambreForm.valid && this.ambreForm.value.id) {
      const updatedData = { ...this.ambreForm.value, updatedAt: new Date() };

      this.ambreService.updateAmbre(updatedData.id, updatedData).then(() => {
        this.resetForm();
        alert('Ambre updated successfully!');
      });
    } else {
      alert('Please select an Ambre to update and fill out all required fields.');
    }
  }

  editAmbre(amb: Ambre): void {
    this.ambreForm.patchValue({
      id: amb.id,
      name: amb.name,
      price: amb.price,
      description: amb.description,
      stock: amb.stock,
      images: amb.images,
      createdAt: amb.createdAt,
      updatedAt: amb.updatedAt,
    });
    this.imagePreview = amb.images; // Affiche les images actuelles en preview
  }

  deleteAmbre(amb: Ambre): void {
    if (window.confirm(`Are you sure you want to delete ${amb.name}?`)) {
      this.ambreService.deleteAmbre(amb).then(() => {
        alert('Ambre deleted successfully!');
      });
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.ambreForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
