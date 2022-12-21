import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from './material/material.module';
// import { MenuListItemComponent } from './components/sidebar/menu-list-item.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmOtpComponent } from './components/confirm-otp/confirm-otp.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from './components/popup/popup.component';
import { SearchPipe } from './pipe/search.pipe';
import { RequestLogDetailsPopupComponent } from './components/popup/request-log-details-popup/request-log-details-popup.component';
import { MobilePopupComponent } from './components/mobile-popup/mobile-popup.component';
import { TransConfirmationPopupComponent } from './components/popup/trans-confirmation-popup/trans-confirmation-popup.component';
import { ParamValueIsGreaterthanDirective,PhoneNumberValidatorDirective } from './custom-validators/custom-validators.directive';
import { InfoPopupComponent } from './components/popup/info-popup/info-popup.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';
import { DialogData} from './components/mobile-popup/mobile-popup.component'
@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ConfirmOtpComponent,
    LoaderComponent,
    PopupComponent,
    SearchPipe,
    RequestLogDetailsPopupComponent,
    MobilePopupComponent,
    TransConfirmationPopupComponent,
    InfoPopupComponent,
    ConfirmationDialogComponent,
    ParamValueIsGreaterthanDirective,
    PhoneNumberValidatorDirective,
    DialogData
  ],
  providers: [DatePipe, ConfirmationDialogService],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,    
  ],
  exports: [
    ConfirmOtpComponent,
    FooterComponent,
    HeaderComponent,
    LeftSidebarComponent,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    PopupComponent,
    NgbModule, 
    SearchPipe,
    RequestLogDetailsPopupComponent,
    MobilePopupComponent,
    TransConfirmationPopupComponent,
    InfoPopupComponent,
    ConfirmationDialogComponent,
    ParamValueIsGreaterthanDirective,
    PhoneNumberValidatorDirective,
    DialogData
  ],
})
export class SharedModule {}
