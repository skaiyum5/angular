import { Component, OnInit, ViewChild } from '@angular/core';
import { IBenefitTypeResponse } from 'src/app/models/benefit_type.model';
import { IBenefitResponse } from 'src/app/models/benefit.model';
import { BenefitsService } from 'src/app/services/benefit.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css'],
})
export class BenefitsComponent implements OnInit {
  benefitTypeList: IBenefitTypeResponse[];
  benefitList: IBenefitResponse[];
  showMore = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  discountIcon: string = `assets/images/discount_icon.png`;
  addressIcon: string = `assets/images/address_icon.png`;
  webIcon: string = `assets/images/web_icon.png`;
  phoneIcon: string = `assets/images/phone_icon.png`;

  constructor(
    private benefitService: BenefitsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getBenefitType();
  }

  getBenefitType() {
    this.benefitService.getBenefitType().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.benefitTypeList = Response.Result as IBenefitTypeResponse[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert('Benefit Types Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Benefit Types Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getBenefits(typeId: string) {
    this.benefitService.getBenefits(typeId).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.benefitList = Response.Result as IBenefitResponse[];
        console.log(this.benefitList);
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert('Benefit Information Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Benefit Information Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  openGroup(typeId: string) {
    console.log(typeId);
    this.getBenefits(typeId);
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
