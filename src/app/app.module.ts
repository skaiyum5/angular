import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { UserLoginComponent } from './features/user-login/user-login.component';
import { SelfRegistrationComponent } from './features/anonymous-user/self-registration/self-registration.component';
import { PasswordRecoveryComponent } from './features/anonymous-user/password-tpin-recovery/password-recovery.component';
import { UserIDRecoveryComponent } from './features/anonymous-user/userid-recovery/userid-recovery.component';
import { SignupInstructionComponent } from './features/anonymous-user/signup-instruction/signup-instruction.component';

import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AdminLoginComponent } from './features/admin-login/admin-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginStatusComponent } from './features/login-status/login-status.component';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { DefaultModule } from './layouts/default/default.module';
import { IpServiceService } from './services/ip-service.service';
// import { MenuComponent } from './features/dashboard-one/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    AdminLoginComponent,
    PageNotFoundComponent, 
    LoginStatusComponent,
    SelfRegistrationComponent,
    PasswordRecoveryComponent,
    UserIDRecoveryComponent,
    SignupInstructionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DefaultModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService,
    IpServiceService
  ],
  bootstrap: [AppComponent],
  //entryComponents: [AdminLoginComponent]
})
export class AppModule { }
