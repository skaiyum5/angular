import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, AnonymousUserRoutingModule } from './anonymous-user-routing.module'
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, AnonymousUserRoutingModule, RouterModule, SharedModule
  ]
})
export class AnonymousUserModule { }
