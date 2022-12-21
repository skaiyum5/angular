import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  components,
  OtherServicesRoutingModule,
} from './other-services-routing.module';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    OtherServicesRoutingModule,
    RouterModule,
    SharedModule,
    FormsModule,
  ],
})
export class OtherServicesModule {}
