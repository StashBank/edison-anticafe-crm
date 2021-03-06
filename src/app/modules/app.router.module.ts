import { ExpenseCardComponent } from '../components/expense-card/expense-card.component';
import { OrderListComponent } from '../components/order-list/order-list.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { TariffCardComponent } from '../components/tariff-card/tariff-card.component';
import { OrderCardComponent } from '../components/order-card/order-card.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { LookupsComponent } from '../components/lookups/lookups.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';
import { ExpenseListComponent } from '../components/expense-list/expense-list.component';
import { IncomeCardComponent } from '../components/income-card/income-card.component';
import { IncomeListComponent } from '../components/income-list/income-list.component';
import { LoginComponent } from '../components/login/login.component';
import {BookListComponent} from '../components/book-list/book-list.component';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { AdminGuard } from '../guards/admin.guard';
import { UserListComponent } from '../../../src/app/components/user-list/user-list.component';


const appRoutes = [
  { path: 'contacts', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact/:id', component: ContactCardComponent },
  { path: 'contact', pathMatch: 'full', component: ContactCardComponent },
  { path: 'lookup/Tariff', component: TariffCardComponent, canActivate: [AdminGuard] },
  { path: 'lookup/Product', component: ProductCardComponent, canActivate: [AdminGuard] },
  { path: 'lookup/:lookupName', component: LookupsComponent, canActivate: [AdminGuard] },
  { path: 'order', component: OrderCardComponent },
  { path: 'order/:id', component: OrderCardComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'expenses', component: ExpenseListComponent},
  { path: 'expense', component: ExpenseCardComponent },
  { path: 'expense/:id', component: ExpenseCardComponent },
  { path: 'incomes', component: IncomeListComponent },
  { path: 'income', component: IncomeCardComponent },
  { path: 'income/:id', component: IncomeCardComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'create-new-user', component: CreateUserComponent, canActivate: [AdminGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'main', redirectTo: '/contacts'},
  { path: '', pathMatch: 'full', redirectTo: '/contacts'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule { }
