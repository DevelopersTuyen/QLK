import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { WarehouseSlipsComponent } from './warehouse-slips/warehouse-slips.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { DebtManagementComponent } from './debt-management/debt-management.component';
import { SalesManagementComponent } from './sales-management/sales-management.component';
import { SupplierManagementComponent } from './supplier-management/supplier-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect empty path to /home
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'AccountManagement', component: AccountManagementComponent, canActivate: [AuthGuard] },
  { path: 'InventoryManagement', component: InventoryManagementComponent, canActivate: [AuthGuard] },
  { path: 'WarehouseSlips', component: WarehouseSlipsComponent, canActivate: [AuthGuard] },
  { path: 'SupplierManagement', component: SupplierManagementComponent, canActivate: [AuthGuard] },
  { path: 'SalesManagement', component: SalesManagementComponent, canActivate: [AuthGuard] },
  { path: 'DebtManagement', component: DebtManagementComponent, canActivate: [AuthGuard] },
  { path: 'CustomerManagement', component: CustomerManagementComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
