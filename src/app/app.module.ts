import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
// import { manageAmbreComponent } from './manageAmbre/manageAmbre.component';
// import { AmbreComponent } from './ambre/ambre.component';
import { CartComponent } from './cart/cart.component';
// import { AmbrdetailComponent } from './ambrdetail/ambrdetail.component';
import { CategoriesComponent } from './categories/categories.component';
import { SousCategoriesComponent } from './sous-categories/sous-categories.component';
import { ProduitsComponent } from './produits/produits.component';
import { PierredetailComponent } from './pierredetail/pierredetail.component';
import { ProduitdetailComponent } from './produitdetail/produitdetail.component';
import { CommandeComponent } from './commande/commande.component';
import { FooterComponent } from './footer/footer.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ConsultationComponent } from './consultation/consultation.component';
// import { NewsManagementComponent } from './admin/news-management/news-management.component';
import { UniquePiecesManagementComponent } from './admin/unique-pieces-management/unique-pieces-management.component';
import { NewsComponent } from './news/news.component';
import { PieceUniqueComponent } from './piece-unique/piece-unique.component';
import { PieceUniqueDetailComponent } from './piece-unique-detail/piece-unique-detail.component';
import { ProposComponent } from './propos/propos.component';
import { AvisComponent } from './avis/avis.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    // manageAmbreComponent,
    // AmbreComponent,
    CartComponent,
    // AmbrdetailComponent,
    CategoriesComponent,
    SousCategoriesComponent,
    ProduitsComponent,
    PierredetailComponent,
    ProduitdetailComponent,
    CommandeComponent,
    FooterComponent,
    SearchResultComponent,
    ConsultationComponent,
    // NewsManagementComponent,
    UniquePiecesManagementComponent,
    NewsComponent,
    PieceUniqueComponent,
    PieceUniqueDetailComponent,
    ProposComponent,
    AvisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase)
      ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
