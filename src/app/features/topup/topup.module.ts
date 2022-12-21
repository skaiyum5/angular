import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, TopUpRoutingModule } from './topup-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [components],
  imports: [CommonModule, TopUpRoutingModule, RouterModule, SharedModule],
})
export class TopupModule {}
