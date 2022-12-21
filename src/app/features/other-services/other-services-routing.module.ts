import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BenefitsComponent } from './benefits/benefits.component';
import { PartnerComponent } from './partner/partner.component';
import { NotificationComponent } from './notification/notification.component';
import { SingleNotificationComponent } from './notification/single-notification.component';

export const components = [
  BenefitsComponent,
  PartnerComponent,
  NotificationComponent,
  SingleNotificationComponent,
];

const routes: Routes = [
  {
    path: 'benefits',
    component: BenefitsComponent,
  },
  {
    path: 'partners',
    component: PartnerComponent,
  },
  {
    path: 'notifications',
    component: NotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherServicesRoutingModule {}
