import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISchemeAccountReq } from 'src/app/models/scheme_account_req.model';
import { ISchemeDetails } from 'src/app/models/scheme_details.model';
import { AccountOpeningService } from 'src/app/services/account-opening.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-scheme-account',
  templateUrl: './scheme-account.component.html',
  styleUrls: ['./scheme-account.component.css'],
})
export class SchemeAccountComponent implements OnInit {
  @Input() schemeDetails: ISchemeDetails;
  @Input() productId: string;
  @Input() branchId: string;
  @Input()paymentBranchID:string;
  @Input() branchName:string;
  @Input() accountNumber: string;
  @Output() cancelEmitter = new EventEmitter<boolean>();
  @Output() refreshEmitter = new EventEmitter<boolean>();

  schemeAccReq: ISchemeAccountReq = {};

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private accountOpeningService: AccountOpeningService
  ) {}

  ngOnInit(): void {}

  openSchemeAccount() {
    this.schemeAccReq.SchemeDetailsViewModel = {
      productId: this.productId,
      branchId: this.branchId,
      UserID: this.authenticationService.currentUserValue.userName,
      chkPayInFlag: true,
      chkStandingInstructionFlag: true,
      paymentBranchID: this.paymentBranchID,
      paymentAccountNo: this.accountNumber,
    };
    this.schemeAccReq.SchemeDetails = this.schemeDetails;
    this.accountOpeningService
      .openSchemeAccount(this.schemeAccReq)
      .subscribe((response) => {
        if(response.Status === 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  cancel() {
    this.cancelEmitter.emit(false);
  }

  onCloseModal(close: boolean) {
    if(close === false) {
      this.cancelEmitter.emit(false);
      this.refreshEmitter.emit(true);
    }
  }
}
