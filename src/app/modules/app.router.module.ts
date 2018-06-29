import { ExpenseCardComponent } from './../components/expense-card/expense-card.component';
import { OrderListComponent } from './../components/order-list/order-list.component';
import { ProductCardComponent } from './../components/product-card/product-card.component';
import { TariffCardComponent } from './../components/tariff-card/tariff-card.component';
import { OrderCardComponent } from './../components/order-card/order-card.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { LookupsComponent } from './../components/lookups/lookups.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';
import { ExpenseListComponent } from '../components/expense-list/expense-list.component';
import { IncomeCardComponent } from '../components/income-card/income-card.component';
import { IncomeListComponent } from '../components/income-list/income-list.component';
import { LoginComponent } from '../components/login/login.component';

const appRoutes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'contact/:id', component: ContactCardComponent },
  { path: 'contact', pathMatch: 'full', component: ContactCardComponent },
  { path: 'lookup/Tariff', component: TariffCardComponent },
  { path: 'lookup/Product', component: ProductCardComponent },
  { path: 'lookup/:lookupName', component: LookupsComponent },
  { path: 'order', component: OrderCardComponent },
  { path: 'order/:id', component: OrderCardComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'expenses', component: ExpenseListComponent},
  { path: 'expense', component: ExpenseCardComponent },
  { path: 'expense/:id', component: ExpenseCardComponent },
  { path: 'incomes', component: IncomeListComponent },
  { path: 'income', component: IncomeCardComponent },
  { path: 'income/:id', component: IncomeCardComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule { }
