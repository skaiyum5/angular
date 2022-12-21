import { Component, OnInit, ViewChild } from '@angular/core';
import { IPartnerTypeResponse } from 'src/app/models/partner_type.model';
import { IPartnerResponse } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
})
export class PartnerComponent implements OnInit {
  partnerTypeList: IPartnerTypeResponse[];
  partnerList: IPartnerResponse[];

  webIcon: string = `assets/images/web_icon.png`;
  phoneIcon: string = `assets/images/phone_icon.png`;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private partnerService: PartnerService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getPartnerType();
  }

  getPartnerType() {
    this.partnerService.getPartnerType().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.partnerTypeList = Response.Result as IPartnerTypeResponse[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert('Partner Types Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Partner Types Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getPartners(typeId: string) {
    this.partnerService.getPartners(typeId).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.partnerList = Response.Result as IPartnerResponse[];       
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {      
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Benefit Information Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  openGroup(typeId: string) {    
    this.getPartners(typeId);
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
