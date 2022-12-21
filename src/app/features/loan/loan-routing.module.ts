import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanComponent } from './loan.component';
import { LoanLogComponent } from './loan-log/loan-log.component';
import { HomeBankBranchResolverResolver } from 'src/app/services/home-bank-branch-resolver.service';
import { LoanAssetsComponent } from './loan-assets.component';
import { LoanReferencesComponent } from './loan-references.component';
import { LoanApplicationListResolver } from 'src/app/services/loan-application-list.service';
import { LoanDetailsComponent } from './loan-log/loan-details.component';
import { LoanDetailsResolver } from 'src/app/services/loan-details-resolver.service';
import { ApplicationDetailsComponent } from './loan-log/application-details.component';
import { LoanReferencesDetailsComponent } from './loan-log/loan-references-details.component';
import { AssetDetailsComponent } from './loan-log/asset-details.component';

export const components = [
  LoanComponent,
  LoanLogComponent,
  LoanAssetsComponent,
  LoanReferencesComponent,
  LoanDetailsComponent,
  ApplicationDetailsComponent,
  AssetDetailsComponent,
  LoanReferencesDetailsComponent,
];

const routes: Routes = [
  {
    path: '',
    component: LoanComponent,
    resolve: { homeBranchList: HomeBankBranchResolverResolver },
    data: { branchType: '0' },
  },
  {
    path: 'log',
    component: LoanLogComponent,
    resolve: { loanApplications: LoanApplicationListResolver },
  },
  {
    path: 'details/:LoanRequestID',
    component: LoanDetailsComponent,
    resolve: { loanDetails: LoanDetailsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRoutingModule {}
