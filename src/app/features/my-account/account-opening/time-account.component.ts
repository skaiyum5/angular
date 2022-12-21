import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITimeAccountReq } from 'src/app/models/time_account_req.model';
import { ITimeAccDetails } from 'src/app/models/time_acc_details.model';
import { AccountOpeningService } from 'src/app/services/account-opening.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-time-account',
  templateUrl: './time-account.component.html',
  styleUrls: ['./time-account.component.css'],
})
export class TimeAccountComponent implements OnInit {
  @Input() timeAccDetails: ITimeAccDetails;
  @Input() productId: string;
  @Input() branchId: string;
  @Input() branchName: string;
  @Input() accountNumber: string;
  @Input() paymentBranchID:string;
  @Output() cancelEmitter = new EventEmitter<boolean>();
  @Output() refreshEmitter = new EventEmitter<boolean>();

  timeAccReq: ITimeAccountReq = {};

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

  openTimeAccount() {
    this.timeAccReq.saveTimeDetailsViewModel = {
      productID: this.productId,
      branchID: this.branchId,
      paymentBranchID: this.paymentBranchID,
      paymentAccountNO: this.accountNumber,
      chkTransferInterest: true,
    };
    this.timeAccReq.timeDetails = this.timeAccDetails;

    this.accountOpeningService
      .openTimeAccount(this.timeAccReq)
      .subscribe((response) => {
        if (response.Status === 'OK') {
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

  onCloseModal(close: boolean) {
    if (close === false) {
      this.cancelEmitter.emit(false);
      this.refreshEmitter.emit(true);
    }
  }

  cancel() {
    this.cancelEmitter.emit(false);
  }
}
