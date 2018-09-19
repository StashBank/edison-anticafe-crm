import { UnauthorizedHttpInterceptor } from './services/unauthorized-http-interceptor.service';
import { LookupsService } from './services/lookups.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
  MatExpansionModule,
  MatCheckboxModule,
  MAT_DATE_LOCALE
} from '@angular/material';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';

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
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './services/user.service';
import { BookListComponent} from './components/book-list/book-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from '../../src/app/components/user-list/user-list.component';


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
    BookListComponent,
    AddProductDialogComponent,
    LoginComponent,
    CreateUserComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRouterModule,
    NgxSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatNativeDateModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatExpansionModule,
    TextMaskModule
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
    ContactCardDialogComponent,
    AddProductDialogComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedHttpInterceptor, multi: true },
    ContactServiceService,
    LookupsService,
    OrderService,
    ExpenseService,
    IncomeService,
    UserService,
    AdminGuard,
    {
      provide: LOCALE_ID,
      useValue: 'uk-UA'
    },
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
