import { OrderListComponent } from './../components/order-list/order-list.component';
import { ProductCardComponent } from './../components/product-card/product-card.component';
import { TariffCardComponent } from './../components/tariff-card/tariff-card.component';
import { OrderCardComponent } from './../components/order-card/order-card.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { LookupsComponent } from './../components/lookups/lookups.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';

const appRoutes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'contact/:id', component: ContactCardComponent },
  { path: 'contact', pathMatch: 'full', component: ContactCardComponent },
  { path: 'lookup/Tariff', component: TariffCardComponent },
  { path: 'lookup/Product', component: ProductCardComponent },
  { path: 'lookup/:lookupName', component: LookupsComponent },
  { path: 'order', component: OrderCardComponent },
  { path: 'order/:id', component: OrderCardComponent },
  { path: 'orders', component: OrderListComponent }
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
