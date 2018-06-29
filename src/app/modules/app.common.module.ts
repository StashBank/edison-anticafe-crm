import { AppRouterModule } from './app.router.module';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { ControlComponent } from '../components/control/control.component';
import { LookupsService } from '../services/lookups.service';
import { ContactServiceService } from '../services/contact-service.service';
import { ContactCardDialogComponent } from '../components/contact-card-dialog/contact-card-dialog.component';
import { LookupsComponent } from '../components/lookups/lookups.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';
import { OrderCardComponent } from '../components/order-card/order-card.component';
import { TariffCardComponent } from '../components/tariff-card/tariff-card.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { OrderService } from '../services/order.service';
import { OrderListComponent } from '../components/order-list/order-list.component';
import { ExpenseListComponent } from '../components/expense-list/expense-list.component';
import { ExpenseCardComponent } from '../components/expense-card/expense-card.component';
import { ExpenseService } from '../services/expense.service';
import { IncomeService } from '../services/income.service';
import { IncomeCardComponent } from '../components/income-card/income-card.component';
import { IncomeListComponent } from '../components/income-list/income-list.component';
import { AddProductDialogComponent } from '../components/add-product-dialog/add-product-dialog.component';
import { AppCoreModule } from './app.core.module';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatTableModule,
  MatSortModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatTabsModule,
  MatExpansionModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    ControlComponent,
    ContactCardDialogComponent,
    LookupsComponent,
    ContactCardComponent,
    OrderCardComponent,
    TariffCardComponent,
    ProductCardComponent,
    OrderListComponent,
    ExpenseListComponent,
    ExpenseCardComponent,
    IncomeCardComponent,
    IncomeListComponent,
    AddProductDialogComponent
  ],
  imports: [
    AppCoreModule,
    AppRouterModule,

MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule

  ],
  exports: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    ControlComponent,
    ContactCardDialogComponent,
    LookupsComponent,
    ContactCardComponent,
    OrderCardComponent,
    TariffCardComponent,
    ProductCardComponent,
    OrderListComponent,
    ExpenseListComponent,
    ExpenseCardComponent,
    IncomeCardComponent,
    IncomeListComponent,
    AddProductDialogComponent
  ],
  entryComponents: [
    ContactCardDialogComponent,
    AddProductDialogComponent
  ],
  providers: [
    ContactServiceService,
    // LookupsService,
    OrderService,
    ExpenseService,
    IncomeService
  ],
  bootstrap: [AppComponent]
})
export class AppCommonModule { }
