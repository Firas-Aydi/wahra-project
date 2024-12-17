import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';  // Utilisation de l'import modulaire de Timestamp
import { Commande } from 'src/app/model/commande';
import { CommandeService } from 'src/app/services/commande.service';
declare var bootstrap: any;

@Component({
  selector: 'app-cart-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.css']
})
export class CartManagementComponent implements OnInit {
  commandes: Commande[] = [];
  selectedCommande: Commande | null = null;

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }
  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe((data: Commande[]) => {
      console.log("Données reçues : ", data);
  
      // Filtrage des commandes avec un timestamp valide
      this.commandes = data.filter(commande => {
        const timestamp = commande.timestamp;
  
        // Vérification si le timestamp est une instance de Firebase Timestamp
        if (timestamp instanceof Timestamp) {  // Utilisation de Timestamp de Firebase v9
          const validTimestamp = !isNaN(timestamp.toDate().getTime());
          console.log(`Commande ${commande.commandeId} a un timestamp valide ? ${validTimestamp}`);
          return validTimestamp;
        }
  
        // Si le timestamp n'est pas un Timestamp de Firebase, vérifiez s'il est valide au format Date
        const validTimestamp = timestamp && !isNaN(new Date(timestamp).getTime());
        console.log(`Commande ${commande.commandeId} a un timestamp valide ? ${validTimestamp}`);
        return validTimestamp;
      }).sort((a, b) => {
        const dateA = a.timestamp instanceof Timestamp ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
        const dateB = b.timestamp instanceof Timestamp ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
        return dateB - dateA; // Tri du plus récent au plus ancien
      });
  
      console.log("Commandes après filtrage et tri : ", this.commandes);
    }, error => {
      console.error('Erreur lors de la récupération des commandes :', error);
    });
  }

  getCommandeRowClass(etat: string): string {
    switch (etat) {
      case 'acceptée':
        return 'table-success';
      case 'refusée':
        return 'table-danger';
      case 'en attente':
      default:
        return 'table-warning';
    }
  }

  openDetailsModal(commande: Commande) {
    this.selectedCommande = commande;
    const modalElement = document.getElementById('commandeDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  accepterCommande(commandeId: string) {
    this.commandeService.updateCommandeStatus(commandeId, 'acceptée').then(() => {
      console.log('Commande acceptée');
    });
  }

  refuserCommande(commandeId: string) {
    this.commandeService.updateCommandeStatus(commandeId, 'refusée').then(() => {
      console.log('Commande refusée');
    });
  }
}
