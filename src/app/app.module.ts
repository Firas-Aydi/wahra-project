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
import { manageAmbreComponent } from './manageAmbre/manageAmbre.component';
import { AmbreComponent } from './ambre/ambre.component';
import { CartComponent } from './cart/cart.component';
import { AmbrdetailComponent } from './ambrdetail/ambrdetail.component';
import { CategoriesComponent } from './categories/categories.component';
import { SousCategoriesComponent } from './sous-categories/sous-categories.component';
import { ProduitsComponent } from './produits/produits.component';
import { BienfaitsComponent } from './bienfaits/bienfaits.component';
import { ProduitdetailComponent } from './produitdetail/produitdetail.component';
import { CommandeComponent } from './commande/commande.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    manageAmbreComponent,
    AmbreComponent,
    CartComponent,
    AmbrdetailComponent,
    CategoriesComponent,
    SousCategoriesComponent,
    ProduitsComponent,
    BienfaitsComponent,
    ProduitdetailComponent,
    CommandeComponent
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
