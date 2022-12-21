import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, TransactionsRoutingModule } from './transactions-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OtherAccountComponent } from './fund-transfer/other-account.component';
import { OwnAccountComponent } from './fund-transfer/own-account.component';
import { EftComponent } from './fund-transfer/eft.component';
import { RtgsComponent } from './fund-transfer/rtgs.component';
import { NpsbComponent } from './fund-transfer/npsb.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    components,
    OtherAccountComponent,
    OwnAccountComponent,
    EftComponent,
    RtgsComponent,
    NpsbComponent,
    
  ],
  imports: [
    CommonModule, TransactionsRoutingModule, RouterModule, SharedModule, 
    ZXingScannerModule
  ]
})
export class TransactionsModule { }
