import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { SecurityAdviceComponent } from './security-advice.component';

export const components = [SecurityAdviceComponent];

const routes: Routes = [
    {
        path: '', component: SecurityAdviceComponent, 
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityAdviceRoutingModule { }
