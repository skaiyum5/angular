import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';

export const components = [BillPaymentComponent];

const routes: Routes = [
  {
    path: 'billpayment', component: BillPaymentComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilityRoutingModule {}
