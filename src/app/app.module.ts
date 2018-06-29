import { UserService } from './services/user.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { LookupsService } from './services/lookups.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppLoginModule } from './modules/app.login.module';
import { AppCommonModule } from './modules/app.common.module';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forRoot([
      { path: 'login', loadChildren: './modules/app.login.module#AppLoginModule' },
      { path: '**', loadChildren: './modules/app.common.module#AppCommonModule' },
    ]),
    OverlayModule
  ],
  providers: [
    UserService,
    LookupsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
