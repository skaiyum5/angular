import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { IChequeBookListResponse } from 'src/app/models/cheque_chequebooklist.model';
import {
  IUnUsedChequeDetail,
  IUnUsedChequeDetailResponse,
} from 'src/app/models/cheque_unusedchequedetail.model';
import { IRequestStopCheque } from 'src/app/models/request-stopcheque.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RequestService } from 'src/app/services/request.service';
import { IAccountListResponse } from '../../../models/account_list.model';
import { BankAccountService } from '../../../services/bankaccount.service';

@Component({
  selector: 'app-stopcheque-request',
  templateUrl: './stopcheque-request.component.html',
  styleUrls: ['./stopcheque-request.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class StopchequeRequestComponent implements OnInit {
  userAccountList: IAccountListResponse[];
  stopCheque: IRequestStopCheque = {};
  chequeBookList: IChequeBookListResponse[];
  unUsedCheque: IUnUsedChequeDetail = {};
  unUsedChequeList: IUnUsedChequeDetailResponse[];

  branchId: string;
  accountNumber: string;
  branchName: string;
  issueDate: string;

  stopChequeForm: UntypedFormGroup;
  loading = false;
  submitted = false;

  otpComponentShow = false;
  goBack: Function;

  otp = '';

  otpSubmit: Function;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private bankAccountService: BankAccountService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.stopChequeForm = this.formBuilder.group({
      BranchId: ['', Validators.required],
      stchAccountNumber: ['', Validators.required],
      txtSearchAccount: [''],
      chequeBook: ['', Validators.required],
      ChequePrefix: ['', Validators.required],
      StartLeafNo: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      EndLeafNo: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      StopCheckNo: [0, Validators.pattern('[0-9]*')],
      ChequeAmount: [
        null,
        [Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],
      ],
      ChequeDate: ['', Validators.required],
      Beneficiary: ['', Validators.required],
      Reason: ['', Validators.required],
      TPIN: [''],
      OTP: [''],
    });

    this.otpSubmit = this.submitOtp.bind(this);
    this.goBack = this.backClick.bind(this);
  }

  getChequbookList(event: any) {
    var acc = event.value.split('_');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
    this.branchName = acc[2];

    this.bankAccountService
      .getChequeBookList(this.branchId, this.accountNumber)
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.chequeBookList = response.Result as IChequeBookListResponse[];
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        }
      });
  }

  getUnusedCheques() {    
    this.unUsedCheque.branchId = this.branchId;
    this.unUsedCheque.accountNumber = this.accountNumber;
    this.unUsedCheque.chequePrefix = this.f.chequeBook.value.split('_')[0];
    this.unUsedCheque.startLeafNo = this.f.chequeBook.value.split('_')[1];
    this.unUsedCheque.endLeafNo = this.f.chequeBook.value.split('_')[2];
    this.issueDate = this.f.chequeBook.value.split('_')[3];

    this.bankAccountService
      .getUnUsedChequeDetails(this.unUsedCheque)
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.unUsedChequeList =
            response.Result as IUnUsedChequeDetailResponse[];
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        }
      });
  }

  get f() {
    return this.stopChequeForm.controls;
  }

  changeComponentVisibility(event: boolean) {
    this.otpComponentShow = event;
  }

  setOtp(otp: string) {
    this.otp = otp;
  }

  selectCheque(event: IRequestStopCheque) {
    this.stopCheque = event;
  }

  submitOtp() {
    this.loading = true;

    this.stopCheque.OTP = this.otp;

    this.requestService
      .sendStopChequeRequest(this.stopCheque)
      .subscribe((Response) => {               
        if (Response.Status == 'OK') {
          this.loading = false;
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.otpComponentShow = false;
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.loading = false;
          this.popupError = true;
          this.header = Response.Status;
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  backClick() {
    this.otpComponentShow = false;
  }
  
  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
