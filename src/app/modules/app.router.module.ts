import { OrderComponent } from './../components/order/order.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { LookupsComponent } from './../components/lookups/lookups.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';

const appRoutes = [
  {path: '', pathMatch: 'full', component: MainComponent},
  {path: 'contact/:id', component: ContactCardComponent},
  {path: 'lookup/:lookupName', component: LookupsComponent},
  {path: 'order', component: OrderComponent}
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
