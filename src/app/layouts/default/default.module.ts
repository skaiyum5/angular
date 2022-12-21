import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardOneComponent } from 'src/app/features/dashboard-one/dashboard-one.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuComponent } from 'src/app/features/dashboard-two/menu.component';
import { EaccountMenuComponent } from 'src/app/features/dashboard-one/eaccount-menu.component';
import { DashboardTwoComponent } from 'src/app/features/dashboard-two/dashboard-two.component';
import { ImageSliderComponent } from '../../features/dashboard-two/image-slider.component';
import { MenuSliderComponent } from './menu-slider/menu-slider.component';
import { SlideMenuComponent } from './menu-slider/slide-menu.component';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardOneComponent,
    DashboardTwoComponent,
    MenuComponent,
    EaccountMenuComponent,
    ImageSliderComponent,
    MenuSliderComponent,
    SlideMenuComponent
  ],
  imports: [CommonModule, RouterModule, SharedModule],
})
export class DefaultModule {}
