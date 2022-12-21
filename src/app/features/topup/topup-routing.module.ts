import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { TopupComponent } from './topup.component';
import { AccountType } from 'src/app/models/app_enum.model';
export const components = [TopupComponent];

const routes: Routes = [
    {
        path: '', component: TopupComponent,
        resolve: {userAccounts: AccountsummaryresolverService},
        data: {accountType: AccountType.FundTransfer.toString()}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopUpRoutingModule { }
