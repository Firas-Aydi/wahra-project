import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Produit } from 'src/app/model/produit';
import { ProductService } from 'src/app/services/produit.service';
import { SousCategorieService } from 'src/app/services/sous-categorie.service';
import { PierreService } from 'src/app/services/pierre.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  produits: Produit[] = [];
  sousCategories: any[] = [];
  pierres: any[] = [];
  form: FormGroup;
  selectedFiles: string[] = [];
  editingIndex: number | null = null;
  isUploading = false;

  constructor(
    private productService: ProductService,
    private sousCategorieService: SousCategorieService,
    private pierreService: PierreService,
    private firestore: AngularFirestore,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sousCategoryId: ['', Validators.required],
      stoneId: ['', Validators.required],
      images: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProduits();
    this.loadSousCategories();
    this.loadPierres();
  }

  loadProduits(): void {
    this.productService.getProduits().subscribe((data) => {
      this.produits = data;
    });
  }

  loadSousCategories(): void {
    this.sousCategorieService.getSousCategories().subscribe((data) => {
      this.sousCategories = data;
    });
  }

  loadPierres(): void {
    this.pierreService.getPierres().subscribe((data) => {
      this.pierres = data;
    });
  }
  generateUniqueId(): string {
    return this.firestore.createId();
  }
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const chambreId = this.form.value.chambreId || this.generateUniqueId(); // Utiliser un ID unique

    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Téléchargement de l'image dans Firebase Storage
      this.productService
        .uploadImage(file, chambreId)
        .subscribe((imageUrl: string) => {
          console.log('Image téléchargée : ', imageUrl); // Log de l'URL
          imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement

          // Log de l'état du tableau images
          console.log("Array d'images après ajout : ", imagesArray);

          // Met à jour le formulaire avec les URLs
          this.form.patchValue({ images: imagesArray });
          this.form.get('images')?.updateValueAndValidity(); // Met à jour la validation du champ
        });
    }
  }

  addProduit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.productService.addProduit(this.form.value).then(() => {
        this.form.reset();
        this.cancelForm();
        this.loadProduits();
      });
    }
  }

  editProduit(index: number): void {
    this.editingIndex = index;
    const produit = this.produits[index];
    this.form.patchValue(produit);
  }

  deleteProduit(id: string): void {
    this.productService.deleteProduit(id).then(() => {
      this.loadProduits();
    });
  }

  cancelForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.editingIndex = null;
  }
}
