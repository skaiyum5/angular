import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountOpeningComponent } from './account-opening/account-opening.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { StatementComponent } from './statement/statement.component';
import { EncashmentRequestComponent } from './encashment-request/encashment-request.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountOpeningReceiptComponent } from './account-opening-receipt/account-opening-receipt.component';

import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { FinancialTransactionsComponent } from './financial-transactions/financial-transactions.component';
import { ChequeListComponent } from './account-details/cheque-list/cheque-list.component';
import { TransactionHistoryComponent } from './account-details/transaction-history/transaction-history.component';
import { FncTransDtlsComponent } from './financial-transactions/fnc-trans-dtls.component';
import { SchemeTimeProductResolverService } from 'src/app/services/scheme-time-product-resolver.service';
import { AccountType } from 'src/app/models/app_enum.model';
import { UserTransactionReceiptComponent } from '../my-account/user-transaction-receipt/user-transaction-receipt.component';
import { ChangeTpinComponent } from './change-Tpin/change-Tpincomponent';

export const components = [
  ChangePasswordComponent,
  ChangeTpinComponent,
  AccountDetailsComponent,
  AccountSummaryComponent,
  StatementComponent,
  EncashmentRequestComponent,
  FinancialTransactionsComponent,
  ChequeListComponent,
  TransactionHistoryComponent,
  FncTransDtlsComponent,
  AccountOpeningComponent,
  AccountOpeningReceiptComponent,
  UserTransactionReceiptComponent
];

const routes: Routes = [
  {
    path: 'account-summary',
    component: AccountSummaryComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.All.toString()}
  },
  {
    path: 'account-details',
    component: AccountDetailsComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.All.toString()}
  },
  {
    path: 'account-open',
    component: AccountOpeningComponent,
    resolve: {
      accountSummary: AccountsummaryresolverService,
      schemeTimeGroup: SchemeTimeProductResolverService,
    },
    data: {accountType: AccountType.Payee.toString()}
  },
  {
    path: 'statement',
    component: StatementComponent,
    resolve: { accountSummary: AccountsummaryresolverService },
    data: {accountType: AccountType.ACSummary.toString()}
  },
  {
    path: 'encashment',
    component: EncashmentRequestComponent,
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'change-tpin',
    component: ChangeTpinComponent,
  },
  {
    path: 'financial-transactions',
    component: FinancialTransactionsComponent,
    resolve: { accountList: AccountsummaryresolverService },
    data: {accountType: AccountType.ACSummary.toString()}
  },
  {
    path: 'account-opening-receipt',
    component: AccountOpeningReceiptComponent,
  },
  {
    path: 'transaction-receipt',
    component: UserTransactionReceiptComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountRoutingModule {}
