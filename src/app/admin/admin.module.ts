import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';
import { StoneManagementComponent } from './stone-management/stone-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    CategoryManagementComponent,
    ProductManagementComponent,
    SubCategoryManagementComponent,
    StoneManagementComponent,
    UserManagementComponent,
    CartManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
