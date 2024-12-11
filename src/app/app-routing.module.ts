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
import { BienfaitsComponent } from './bienfaits/bienfaits.component';
import { CartManagementComponent } from './admin/cart-management/cart-management.component';
import { CategoryManagementComponent } from './admin/category-management/category-management.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { StoneManagementComponent } from './admin/stone-management/stone-management.component';
import { SubCategoryManagementComponent } from './admin/sub-category-management/sub-category-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  
  { path: 'manageAmbre', component: manageAmbreComponent },
  { path: 'ambre', component: AmbreComponent },
  { path: 'ambres/:id', component: AmbrdetailComponent },
  
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:id', component: SousCategoriesComponent },
  
  { path: 'sous-categorie/:sousCategorieId', component: ProduitsComponent },
  { path: 'pierres/:pierreId', component: ProduitsComponent },
  
  { path: 'products/:id', component: ProduitsComponent },
  { path: 'bienfaits/:pierreId', component: BienfaitsComponent },
  
  { path: 'cart', component: CartComponent },
  
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
