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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  
  { path: 'manageAmbre', component: manageAmbreComponent },
  { path: 'ambre', component: AmbreComponent },
  { path: 'ambres/:id', component: AmbrdetailComponent },
  
  // { path: 'categories', component: CategoriesComponent },
  { path: 'categorie/:categorieId', component: SousCategoriesComponent },
  { path: 'sous-categorie/:sousCategorieId', component: ProduitsComponent },
  { path: 'pierres/:pierreId', component: ProduitsComponent },
  
  { path: 'products/:id', component: ProduitdetailComponent },
  { path: 'pierredetail/:id', component: PierredetailComponent },
  
  { path: 'cart', component: CartComponent },
  { path: 'commande', component: CommandeComponent },
  { path: 'search/:term', component: SearchResultComponent },

  { path: 'categories-management', component: CategoryManagementComponent },
  { path: 'sub-categories-management', component: SubCategoryManagementComponent },
  { path: 'products-management', component: ProductManagementComponent },
  { path: 'stones-management', component: StoneManagementComponent },
  { path: 'users-management', component: UserManagementComponent },
  { path: 'carts-management', component: CartManagementComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
