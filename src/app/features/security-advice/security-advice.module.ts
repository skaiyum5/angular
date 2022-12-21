import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, SecurityAdviceRoutingModule } from './security-advice-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [components],
  imports: [CommonModule, SecurityAdviceRoutingModule, RouterModule, SharedModule],
})
export class SecurityAdviceModule {}
