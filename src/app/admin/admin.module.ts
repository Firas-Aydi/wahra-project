import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';
import { StoneManagementComponent } from './stone-management/stone-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { ConsultationManagementComponent } from './consultation-management/consultation-management.component';
import { AvisManagementComponent } from './avis-management/avis-management.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    // CategoryManagementComponent,
    // ProductManagementComponent,
    // SubCategoryManagementComponent,
    // StoneManagementComponent,
    UserManagementComponent,
    AvisManagementComponent,
    // CartManagementComponent,
    // ConsultationManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
