import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
// import { CategoryManagementComponent } from './category-management/category-management.component';
// import { ProductManagementComponent } from './product-management/product-management.component';
import { adminAuthGuard } from '../services/admin-auth.guard';
// import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';
// import { StoneManagementComponent } from './stone-management/stone-management.component';
// import { CartManagementComponent } from './cart-management/cart-management.component';
// import { UserManagementComponent } from './user-management/user-management.component';


const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
  //     { path: 'categories-management', component: CategoryManagementComponent },
  // { path: 'sub-categories-management', component: SubCategoryManagementComponent },
  // { path: 'products-management', component: ProductManagementComponent },
  // { path: 'stones-management', component: StoneManagementComponent },
  // { path: 'users-management', component: UserManagementComponent },
  // { path: 'carts-management', component: CartManagementComponent },
    ],
    canActivate: [adminAuthGuard], // Utilisez `adminAuthGuard` ici
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
