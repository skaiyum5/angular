import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  components,
  MyServicesRoutingModule,
} from './my-services-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestResolverService } from 'src/app/services/request-resolver.service';
import { ContactDetailResolverService } from 'src/app/services/contact-detail-resolver.service';
import { AccountsummaryresolverService } from 'src/app/services/accountsummaryresolver.service';

@NgModule({
  declarations: [components],
  imports: [CommonModule, MyServicesRoutingModule, RouterModule, SharedModule],
  providers: [RequestResolverService, ContactDetailResolverService, AccountsummaryresolverService],
})
export class MyServicesModule {}
