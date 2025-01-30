import { Component, OnInit } from '@angular/core';
import { AvisService } from '../services/avis.service';
import { Avis } from '../model/avis';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css'],
})
export class AvisComponent implements OnInit {
  avis: Avis[] = []; // Liste des avis

  constructor(private avisService: AvisService) {}

  // Récupérer les avis lors de l'initialisation
  ngOnInit(): void {
    this.fetchAvis();
  }

  // Méthode pour récupérer les avis depuis le service
  fetchAvis(): void {
    this.avisService.getAvis().subscribe((avis) => {
      this.avis = avis;
    });
  }
}
