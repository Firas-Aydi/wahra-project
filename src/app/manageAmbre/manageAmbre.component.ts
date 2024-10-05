import { Component } from '@angular/core';
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
export class manageAmbreComponent {
  ambreList: Ambre[] = [];
  ambreObj: Ambre = {
    id: '',
    name: '',
    price: 0,
    description: '',
  };
  id: string = '';
  name: string = '';
  price: number = 0;
  description: string = '';
  selectedImage: File | null = null; // Store selected image
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private auth: AuthService,
    private amb: AmbreService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getAllAmbre();
  }

  // Handle the image file selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Show the image preview
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
          return data;
        });
      },
      (err) => {
        console.log('Error while fetching Ambre data: ', err);
        alert('Error while fetching Ambre data');
      }
    );
  }

  resetForm() {
    (this.id = ''), (this.name = ''), (this.price = 0), (this.description = '');
    this.selectedImage = null;
    this.imagePreview = null;
  }
  addAmbre() {
    if (this.name == '' || this.price == 0 || this.description == '') {
      alert('Fill all input fields');
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
            this.ambreObj.imageUrl = url;

            this.amb.addAmbre(this.ambreObj).then(() => {
              this.resetForm();
            });
          });
        })
      )
      .subscribe();
  }
  updateAmbre() {}

  deleteAmbre(amb: Ambre) {
    if (window.confirm('Are you sur you want to delete ' + amb.name + ' ?')) {
      this.amb.deleteAmbre(amb);
    }
  }
}
