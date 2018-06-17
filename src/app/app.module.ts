import { LookupsService } from './services/lookups.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { ControlComponent } from './components/control/control.component';
import { ContactServiceService } from './services/contact-service.service';
import { ContactCardDialogComponent } from './components/contact-card-dialog/contact-card-dialog.component';
import { AppRouterModule } from './modules/app.router.module';
import { LookupsComponent } from './components/lookups/lookups.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { TariffCardComponent } from './components/tariff-card/tariff-card.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { OrderService } from './services/order.service';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseCardComponent } from './components/expense-card/expense-card.component';
import { ExpenseService } from './services/expense.service';
import { IncomeService } from './services/income.service';
import { IncomeCardComponent } from './components/income-card/income-card.component';
import { IncomeListComponent } from './components/income-list/income-list.component';

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
    IncomeListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRouterModule,
    NgxSpinnerModule,
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
    MatExpansionModule
  ],
  exports: [
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
    MatTabsModule
  ],
  entryComponents: [
    ContactCardDialogComponent
  ],
  providers: [
    ContactServiceService,
    LookupsService,
    OrderService,
    ExpenseService,
    IncomeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
