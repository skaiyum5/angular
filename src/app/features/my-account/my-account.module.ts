import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, MyAccountRoutingModule } from './my-account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';
import { SchemeAccountComponent } from './account-opening/scheme-account.component';
import { TimeAccountComponent } from './account-opening/time-account.component';

@NgModule({
  declarations: [components, SchemeAccountComponent, TimeAccountComponent],
  imports: [
    CommonModule, MyAccountRoutingModule, SharedModule, RouterModule
  ],
  providers: []  
})
export class MyAccountModule { }
