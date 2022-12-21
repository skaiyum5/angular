import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './features/admin-login/admin-login.component';
import { DashboardOneComponent } from './features/dashboard-one/dashboard-one.component';
import { DashboardThreeComponent } from './features/dashboard-three/dashboard-three.component';
import { DashboardTwoComponent } from './features/dashboard-two/dashboard-two.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { UserLoginComponent } from './features/user-login/user-login.component';
import { SelfRegistrationComponent } from './features/anonymous-user/self-registration/self-registration.component';
import { PasswordRecoveryComponent } from './features/anonymous-user/password-tpin-recovery/password-recovery.component';
import { UserIDRecoveryComponent } from './features/anonymous-user/userid-recovery/userid-recovery.component';
import { SignupInstructionComponent } from './features/anonymous-user/signup-instruction/signup-instruction.component';
import { SecurityAdviceComponent } from './features/security-advice/security-advice.component';
import { AuthGuard } from './helpers/auth.guard';
import { DefaultComponent } from './layouts/default/default.component';
import { AccountsummaryresolverService } from './services/accountsummaryresolver.service';
import { AboutUsComponent } from './features/anonymous-user/about-us/about-us.component';
import { PrivacyPolicyComponent } from './features/anonymous-user/privacy-policy/privacy-policy.component';
import { AccountType } from './models/app_enum.model';

const routes: Routes = [
  {
    path: 'login', component: UserLoginComponent
  },
  {
    path: 'selfregistration', component: SelfRegistrationComponent
  },
  {
    path: 'passwordrecovery', component: PasswordRecoveryComponent
  },
  {
    path: 'tpinrecovery', component: PasswordRecoveryComponent
  },
  {
    path: 'useridrecovery', component: UserIDRecoveryComponent
  },
  {
    path: 'instruction', component: SignupInstructionComponent
  },
  {
    path: 'aboutus', component: AboutUsComponent
  },
  {
    path: 'privacypolicy', component: PrivacyPolicyComponent
  },
  {
    path: '', component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', component: DashboardTwoComponent,
        resolve: { userAccounts: AccountsummaryresolverService },
        data: { accountType: AccountType.All.toString() }
      },
      {
        path: 'topup',
        loadChildren: () => import('./features/topup/topup.module')
          .then((m) => m.TopupModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/my-profile/my-profile.module')
          .then((m) => m.MyProfileModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./features/my-account/my-account.module')
          .then((m) => m.MyAccountModule)
      },
      {
        path: 'myservices',
        loadChildren: () => import('./features/my-services/my-services.module')
          .then((m) => m.MyServicesModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./features/transactions/transactions.module')
          .then((m) => m.TransactionsModule)
      },
      {
        path: 'activity',
        loadChildren: () => import('./features/user-activity/user-activity.module')
          .then((m) => m.UserActivityModule)
      },
      {
        path: 'utility',
        loadChildren: () => import('./features/utility/utility.module')
          .then((m) => m.UtilityModule)
      },
      {
        path: 'investment',
        loadChildren: () => import('./features/loan/loan.module')
          .then((m) => m.LoanModule)
      },
      {
        path: 'otherservices',
        loadChildren: () => import('./features/other-services/other-services.module')
          .then((m) => m.OtherServicesModule)
      },
      {
        path: 'securityadvice',
        loadChildren: () => import('./features/security-advice/security-advice.module')
          .then((m) => m.SecurityAdviceModule)
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
