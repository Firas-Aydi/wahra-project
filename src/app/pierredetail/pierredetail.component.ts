import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PierreService } from '../services/pierre.service';
import { Pierre } from '../model/pierre';

@Component({
  selector: 'app-pierredetail',
  templateUrl: './pierredetail.component.html',
  styleUrls: ['./pierredetail.component.css'],
})
export class PierredetailComponent implements OnInit {
  pierre: Pierre | null = null;

  constructor(
    private route: ActivatedRoute,
    private pierreService: PierreService
  ) {}

  ngOnInit(): void {
    const pierreId = this.route.snapshot.paramMap.get('id');
    if (pierreId) {
      this.loadPierreDetails(pierreId);
    }
  }

  loadPierreDetails(pierreId: string): void {
    this.pierreService.getPierreById(pierreId).subscribe(
      (pierre) => {
        if (pierre) {
          this.pierre = pierre;
        } else {
          console.error('Pierre introuvable');
          this.pierre = null; // Gérer le cas où la pierre est indéfinie
        }
      },
      (error) => {
        console.error('Erreur lors du chargement de la pierre :', error);
        this.pierre = null; // Gérer les erreurs
      }
    );
  }
}
