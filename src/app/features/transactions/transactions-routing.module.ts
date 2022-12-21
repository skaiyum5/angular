import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
// import { BillPaymentComponent } from './bill-payment/bill-payment.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { StandingInstructionComponent } from './standing-instruction/standing-instruction.component';
import { BulkTransferComponent } from './fund-transfer/bulk-transfer/bulk-transfer.component';
import { BulkResponseComponent } from './fund-transfer/bulk-transfer/bulk-response.component';
import { AccountType } from '../../models/app_enum.model';
import { BanglaQrComponent } from './banglaqr-payment/banglaqr-payment.component';


export const components = [
  BeneficiaryComponent,
  FundTransferComponent,
  StandingInstructionComponent,
  BulkTransferComponent,
  BulkResponseComponent,
  BanglaQrComponent
];

const routes: Routes = [
  {
    path: 'fundtransfer',
    component: FundTransferComponent,
    resolve: { accountList: AccountsummaryresolverService },
    data: {accountType: AccountType.FundTransfer.toString()}
  },
  {
    path: 'beneficiary',
    component: BeneficiaryComponent,
  },
  {
    path: 'standinginstruction',
    component: StandingInstructionComponent,
  },
  {
    path: 'bulk-transfer',
    component: BulkTransferComponent,
  },
  {
    path: 'bangla-qr',
    component: BanglaQrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
