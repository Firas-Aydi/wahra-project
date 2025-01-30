import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { manageAmbreComponent } from './manageAmbre/manageAmbre.component';
import { AmbreComponent } from './ambre/ambre.component';
import { CartComponent } from './cart/cart.component';
import { AmbrdetailComponent } from './ambrdetail/ambrdetail.component';
import { CategoriesComponent } from './categories/categories.component';
import { SousCategoriesComponent } from './sous-categories/sous-categories.component';
import { ProduitsComponent } from './produits/produits.component';
import { PierredetailComponent } from './pierredetail/pierredetail.component';
import { CartManagementComponent } from './admin/cart-management/cart-management.component';
import { CategoryManagementComponent } from './admin/category-management/category-management.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { StoneManagementComponent } from './admin/stone-management/stone-management.component';
import { SubCategoryManagementComponent } from './admin/sub-category-management/sub-category-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ProduitdetailComponent } from './produitdetail/produitdetail.component';
import { CommandeComponent } from './commande/commande.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { ConsultationManagementComponent } from './admin/consultation-management/consultation-management.component';
import { NewsManagementComponent } from './admin/news-management/news-management.component';
import { UniquePiecesManagementComponent } from './admin/unique-pieces-management/unique-pieces-management.component';
import { NewsComponent } from './news/news.component';
import { PieceUniqueComponent } from './piece-unique/piece-unique.component';
import { PieceUniqueDetailComponent } from './piece-unique-detail/piece-unique-detail.component';
import { ProposComponent } from './propos/propos.component';
import { AvisManagementComponent } from './admin/avis-management/avis-management.component';
import { AvisComponent } from './avis/avis.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'propos', component: ProposComponent },
  { path: 'news', component: NewsComponent },
  { path: 'consultation', component: ConsultationComponent },
  { path: 'avis', component: AvisComponent },
  
  { path: 'manageAmbre', component: manageAmbreComponent },
  { path: 'ambre', component: AmbreComponent },
  { path: 'ambres/:id', component: AmbrdetailComponent },
  
  // { path: 'categories', component: CategoriesComponent },
  { path: 'categorie/:categorieId', component: SousCategoriesComponent },
  { path: 'sous-categorie/:sousCategorieId', component: ProduitsComponent },
  { path: 'pierres/:pierreId', component: ProduitsComponent },
  
  { path: 'products/:id', component: ProduitdetailComponent },
  { path: 'pierredetail/:id', component: PierredetailComponent },
  
  { path: 'unique-pieces/:id', component: PieceUniqueDetailComponent },
  { path: 'unique-pieces', component: PieceUniqueComponent },

  { path: 'cart', component: CartComponent },
  { path: 'commande', component: CommandeComponent },
  { path: 'search/:term', component: SearchResultComponent },

  { path: 'categories-management', component: CategoryManagementComponent },
  { path: 'sub-categories-management', component: SubCategoryManagementComponent },
  { path: 'products-management', component: ProductManagementComponent },
  { path: 'stones-management', component: StoneManagementComponent },
  { path: 'users-management', component: UserManagementComponent },
  { path: 'carts-management', component: CartManagementComponent },
  { path: 'consultations-management', component: ConsultationManagementComponent },
  { path: 'news-management', component: NewsManagementComponent },
  { path: 'unique-pieces-management', component: UniquePiecesManagementComponent },
  { path: 'avis-management', component: AvisManagementComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
