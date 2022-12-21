import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankguaranteeRequestComponent } from './bankguarantee-request/bankguarantee-request.component';
import { ChequebookRequestComponent } from './chequebook-request/chequebook-request.component';
import { LcRequestComponent } from './lc-request/lc-request.component';
import { StatementRequestComponent } from './statement-request/statement-request.component';
import { StopchequeRequestComponent } from './stopcheque-request/stopcheque-request.component';
import { AddresschangeRequestComponent } from './addresschange-request/addresschange-request.component';
import { RequestLogComponent } from './request-log/request-log.component';
import { RequestResolverService } from 'src/app/services/request-resolver.service';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { ContactDetailResolverService } from 'src/app/services/contact-detail-resolver.service';
import { UnusedChequesComponent } from './stopcheque-request/unused-cheques.component';
import { ComplainRequestComponent } from './complain-request/complain-request.component';
import { PayorderRequestComponent } from './payorder-request/payorder-request.component';
import { PositivepayRequestComponent } from './positivepay-request/positivepay-request.component';
import { PapercertificateRequestComponent } from './papercertificate-request/papercertificate-request.component';
import { LostcardRequestComponent } from './lostcard-request/lostcard-request.component';
import { AccountType } from 'src/app/models/app_enum.model';

export const components = [
  RequestLogComponent,
  BankguaranteeRequestComponent,
  ChequebookRequestComponent,
  LcRequestComponent,
  StatementRequestComponent,
  StopchequeRequestComponent,
  AddresschangeRequestComponent,
  UnusedChequesComponent,
  ComplainRequestComponent,
  PayorderRequestComponent,
  PositivepayRequestComponent,
  PapercertificateRequestComponent,
  LostcardRequestComponent
];

const routes: Routes = [
  {
    path: 'addresschangerequest',
    component: AddresschangeRequestComponent,
    // resolve: { contactInfo: ContactDetailResolverService },
    // data: { addressType: '1' },
  },
  {
    path: 'bankguaranteerequest',
    component: BankguaranteeRequestComponent,
  },
  {
    path: 'chequebookrequest',
    component: ChequebookRequestComponent,
  },
  {
    path: 'lcrequest',
    component: LcRequestComponent,
  },
  {
    path: 'statementrequest',
    component: StatementRequestComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.ACSummary.toString()}
  },
  {
    path: 'stopchequerequest',
    component: StopchequeRequestComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.Payable.toString()}
  },
  {
    path: 'complainrequest',
    component: ComplainRequestComponent,
  },
  {
    path: 'payorderrequest',
    component: PayorderRequestComponent,  
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.Payable.toString()}
  },
  {
    path: 'positivepayrequest',
    component: PositivepayRequestComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.Payable.toString()}
  },
  {
    path: 'papercertificaterequest',
    component: PapercertificateRequestComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.Payable.toString()}
  },
  {
    path: 'lostcardrequest',
    component: LostcardRequestComponent,    
  },
  {
    path: 'request-log',
    component: RequestLogComponent,
    resolve: { requstLog: RequestResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyServicesRoutingModule {}
