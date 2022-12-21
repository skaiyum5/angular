import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanRoutingModule } from './loan-routing.module';
import { components } from './loan-routing.module';
import { LoanDocumentsComponent } from './loan-log/loan-documents.component';

@NgModule({
  declarations: [components, LoanDocumentsComponent],
  imports: [CommonModule, LoanRoutingModule, RouterModule, SharedModule],
})
export class LoanModule {}
