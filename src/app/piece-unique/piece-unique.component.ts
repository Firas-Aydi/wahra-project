import { Component } from '@angular/core';
import { UniquePiece } from '../model/unique-piece';
import { UniquePieceService } from '../services/unique-piece.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-piece-unique',
  templateUrl: './piece-unique.component.html',
  styleUrls: ['./piece-unique.component.css']
})
export class PieceUniqueComponent {

  uniquePieces: UniquePiece[] = [];
  pierreId: string = '';

  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private uniquePieceService: UniquePieceService,
  ) {}

  ngOnInit(): void {
    this.loadUniquePieces();

    
  }

  loadUniquePieces(): void {
    this.uniquePieceService.getAllUniquePieces().subscribe(
      (pieces) => {
        this.uniquePieces = pieces;
      },
      (error) => {
        console.error('Error loading unique pieces:', error);
      }
    );
  }
  
  viewUniquePieceDetails(produitId: string | undefined) {
    if (produitId) {
      this.router.navigate(['/unique-pieces', produitId]);
    } else {
      console.error(
        'produit ID is undefined. Cannot navigate to produit details.'
      );
    }
  }
}
