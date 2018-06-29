
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './../components/login/login.component';
import { AppCoreModule } from './app.core.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AppCoreModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
  ],
  exports: [
    AppCoreModule
  ],
  providers: [
  ]
})
export class AppLoginModule {}
