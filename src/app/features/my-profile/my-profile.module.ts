import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, MyProfileRoutingModule } from './my-profile-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms'; 

import { UserProfileService } from '../../services/userprofile.service';
import { ContactdetailsService } from 'src/app/services/contactdetails.service';
import { ContactDetailResolverService } from 'src/app/services/contact-detail-resolver.service';

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule, MyProfileRoutingModule, RouterModule, SharedModule, FormsModule
  ],
  providers: [UserProfileService, ContactdetailsService, ContactDetailResolverService]
})
export class MyProfileModule { }
