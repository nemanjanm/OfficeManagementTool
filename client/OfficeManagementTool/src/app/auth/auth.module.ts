import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './components/changepassword/change-password.component';
import { ForgotPasswordComponent } from './components/forgotpassword/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { StorageService } from './services/storage.service';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ForgotPasswordComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    JwtModule
  ],
  exports:[],
  providers: [
    AuthService,
    StorageService
  ]
})
export class AuthModule { }