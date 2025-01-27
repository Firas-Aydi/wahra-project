import { Component, OnInit } from '@angular/core';
import { AvisService } from 'src/app/services/avis.service';
import { Avis } from 'src/app/model/avis';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-avis-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './avis-management.component.html',
  styleUrls: ['./avis-management.component.css'],
})
export class AvisManagementComponent implements OnInit {
  avis: Avis[] = [];
  newAvisText: string = '';
  newAvisVideos: string[] = [];
  selectedAvis: Avis | null = null;
  form: FormGroup;
  selectedFile: File | null = null;

  showConfirmationModal: boolean = false;
  avisToDeleteId: string | null = null;

  editingIndex: number | null = null;
  isUploading = false;

  selectedVideoPreviews: string[] = [];
  selectedVideoFiles: File[] = [];

  constructor(private avisService: AvisService, private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      avis: [''],
      videos: [[]],
    });
  }

  ngOnInit(): void {
    this.fetchAvis();
  }

  // Récupérer tous les avis
  fetchAvis(): void {
    this.avisService.getAvis().subscribe((avis) => {
      this.avis = avis;
    });
  }

  saveForm(): void {
    if (this.form.invalid) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    if (this.selectedFile) {
      this.isUploading = true;
      this.avisService.uploadFile(this.selectedFile).subscribe((url) => {
        this.isUploading = false;
        this.form.patchValue({ image: url });
        this.saveAvis();
      });
    } else {
      this.saveAvis();
    }
  }

  saveAvis(): void {
    const formValue = this.form.value;

    if (this.editingIndex !== null) {
      const id = this.avis[this.editingIndex].id;
      this.avisService.updateAvis(id, formValue).then(() => {
        this.avis[this.editingIndex!] = { ...formValue, id };
        this.resetForm();
      });
    } else {
      const newProduit: Avis = { ...formValue, id: '' };
      this.avisService.addAvis(newProduit).then(() => {
        this.fetchAvis();
        this.resetForm();
      });
    }
  }

  // Sélectionner un avis pour modification
  selectAvis(avis: Avis): void {
    this.selectedAvis = { ...avis }; // Clone de l'avis sélectionné
  }
  editAvis(index: number): void {
    this.editingIndex = index;
    const avis = this.avis[index];
    this.form.patchValue({ ...avis || [] }); // Assurez-vous d'envoyer un tableau

    this.selectedVideoPreviews = [...(avis.videos || [])];
  }


  // Supprimer un avis
  deleteAvis(id: string): void {
    this.avisService.deleteAvis(id).then(() => {
      this.fetchAvis();
    });
  }

    onVideoFileChange(event: any): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);
        this.isUploading = true;
        const uploadObservables = files.map((file) =>
          this.avisService.uploadFile(file)
        );
  
        // Traiter tous les fichiers en parallèle
        forkJoin(uploadObservables).subscribe(
          (urls) => {
            const videosArray = this.form.get('videos')?.value || [];
            this.form.patchValue({ videos: [...videosArray, ...urls] });
            this.isUploading = false;
          },
          (error) => {
            console.error('Erreur lors de l\'upload :', error);
            this.isUploading = false;
          }
        );
      }
    }
  
    removeSelectedVideo(videoUrl: string): void {
      const videosArray = this.form.get('videos')?.value || [];
      const index = videosArray.indexOf(videoUrl);
      if (index > -1) {
        videosArray.splice(index, 1); // Supprime l'URL de l'image du tableau
        this.form.patchValue({ videos: videosArray });
  
        // Supprime l'image de Firebase Storage
        this.avisService.deleteFile(videoUrl).catch((error) => {
          console.error('Erreur lors de la suppression de le vidéo :', error);
        });
      }
    }

  resetForm(): void {
    this.form.reset();
    this.editingIndex = null;
    this.selectedVideoPreviews = [];
    this.selectedVideoFiles = [];
  }

  openConfirmationModal(productId: string): void {
    this.showConfirmationModal = true;
    this.avisToDeleteId = productId;
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.avisToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.avisToDeleteId) {
      this.avisService.deleteAvis(this.avisToDeleteId).then(() => {
        this.fetchAvis();
        this.closeConfirmationModal();
      });
    }
  }
}
