import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, UserActivityRoutingModule } from './user-activity-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [components],
  imports: [
    CommonModule, UserActivityRoutingModule, RouterModule, SharedModule
  ]
})
export class UserActivityModule { }
