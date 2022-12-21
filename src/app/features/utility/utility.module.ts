import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, UtilityRoutingModule } from './utility-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    UtilityRoutingModule,
    RouterModule, 
    SharedModule
  ]
})
export class UtilityModule { }
