import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Collapse } from 'bootstrap';
import { CategorieService } from 'src/app/services/categorie.service';
import { SousCategorieService } from '../services/sous-categorie.service';

interface UserData {
  role: string;
  // Add other fields as necessary, e.g. name, email, etc.
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isUser: boolean = false;
  userType: string = ''; // Ajoutez une propriété pour stocker le type d'utilisateur
  isNavbarOpen=false;
  categories: any[] = []; // Liste des catégories avec sous-catégories
  // sousCategories: any[] = [];

  constructor(
    private categoryService: CategorieService,
    private sousCategorieService: SousCategorieService,
    private af: AngularFireAuth,
    private route: Router,
    private as: AuthService,
    private firestore: AngularFirestore
  ) {
    this.as.user.subscribe((user) => {
      if (user) {
        this.isUser = true;
        const userId = user.uid;
        this.firestore
          .collection('users')
          .doc(userId)
          .get()
          .subscribe((doc) => {
            console.log('doc:', doc);
            if (doc.exists) {
              const userData = doc.data() as UserData;
              if (userData && userData.role) {
                this.userType = userData.role;
                console.log('User Type:', this.userType);
              } else {
                // console.log('Role not found in user data');
              }
            } else {
              // console.log('User data not found');
            }
          });
      } else {
        this.isUser = false;
        this.userType = '';
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // loadCategories(): void {
  //   this.categoryService.getCategories().subscribe((data) => {
  //     this.categories = data;
  //   });
  // }
  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      // console.log('Catégories récupérées :', categories);
  
      this.categories = categories.map((category) => ({
        ...category,
        sousCategories: [],
      }));
  
      this.sousCategorieService.getSousCategories().subscribe((sousCategories) => {
        // console.log('Sous-catégories récupérées :', sousCategories);
  
        this.categories.forEach((category) => {
          category.sousCategories = sousCategories.filter(
            (sousCat) => sousCat.categoryId === category.id
          );
  
          // Ajout d'un log pour vérifier la correspondance
          // console.log(
          //   `Catégorie : ${category.name}, Sous-Catégories :`,
          //   category.sousCategories
          // );
        });
  
        // console.log('Catégories avec sous-catégories :', this.categories);
      });
    });
  }
  
  
  // loadSousCategories(): void {
  //   this.sousCategorieService.getSousCategories().subscribe((data) => {
  //     this.sousCategories = data;
  //   });
  // }

  logout() {
    this.af
      .signOut()
      .then(() => {
        localStorage.removeItem('userConnect');
        localStorage.removeItem('currentUid');
        this.route.navigate(['/login']);
      })
      .catch(() => {
        // console.log('error');
      });
    this.toggleNavbar();
  }
  toggleNavbar() {
        const navbarCollapse = document.getElementById('navbarSupportedContent');
        
        // Toggle the navbar open/close state
        this.isNavbarOpen = !this.isNavbarOpen;
        if (navbarCollapse?.classList.contains('show')) {
            navbarCollapse.classList.remove('show'); // Collapse it
        } else {
            navbarCollapse?.classList.add('show'); // Open it if not already open
        }
    }
  
}
