import { Component, OnInit, ViewChild } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { RequestService } from '../../../services/request.service';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { IRequestPositivePay } from 'src/app/models/request-positivepay.model';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { BankAccountService } from '../../../services/bankaccount.service';
import { IChequeBookListResponse } from 'src/app/models/cheque_chequebooklist.model';
import {
  IUnUsedChequeDetail,
  IUnUsedChequeDetailResponse,
} from 'src/app/models/cheque_unusedchequedetail.model';
import {
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { ActivatedRoute } from '@angular/router';
import * as converter from 'number-to-words';

@Component({
  selector: 'app-positivepay-request',
  templateUrl: './positivepay-request.component.html',
  styleUrls: ['./positivepay-request.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class PositivepayRequestComponent implements OnInit {
  
  positivePayRequestForm: UntypedFormGroup;

  today = this.calendar.getToday();
  positivePayRequest: IRequestPositivePay = {};  
  userAccountList: IAccountListResponse[];
  chequeBookList: IChequeBookListResponse[];
  unUsedCheque: IUnUsedChequeDetail = {};
  unUsedChequeList: IUnUsedChequeDetailResponse[];

  submitted = false;
  loading = false;
  
  branchId: string;
  accountNumber: string;
  startDate: any;
  endDate: any;
  AmountInWords:string;

  minDate = { year: this.today.year - 30, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  otpComponentShow = false;
  otp = '';
  otpSubmit: Function;
  goBack: Function;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private requestService: RequestService,
    private datepipe: DatePipe,
    private loginUser: AuthenticationService,
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.positivePayRequestForm = this.formBuilder.group({
      ddlAccountNumber: ['', Validators.required],
      txtSearchValue: [''],
      ddlChequeBook:['',Validators.required],
      ddlUnusedCheque:['',Validators.required],
      txtAmount:['',[Validators.required, Validators.pattern('[0-9]+')]],
      txtStartDate: ['', Validators.required],
      txtExpiaryDate: ['', Validators.required],
      txtBeneficiaryName:['',Validators.required],
      TPIN: [''],
      OTP: [''],
    });

    this.otpSubmit = this.submitOtp.bind(this);
    this.goBack = this.backClick.bind(this);
  }

  get f() {
    return this.positivePayRequestForm.controls;
  }
 

  getChequbookList(event: any) {
    var acc = event.value.split('_');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
    
    this.bankAccountService
      .getChequeBookList(this.branchId, this.accountNumber)
      .subscribe((response) => {       
        if (response.Status === 'OK') {
          this.chequeBookList = response.Result as IChequeBookListResponse[];
        } else if (response.Status === 'UNAUTH') {
          this.loginUser.logout();
        }
      });
  }

  getUnusedCheques() {   
    this.unUsedCheque.branchId = this.branchId;
    this.unUsedCheque.accountNumber = this.accountNumber;
    this.unUsedCheque.chequePrefix = this.f.ddlChequeBook.value.split('_')[0];
    this.unUsedCheque.startLeafNo = this.f.ddlChequeBook.value.split('_')[1];
    this.unUsedCheque.endLeafNo = this.f.ddlChequeBook.value.split('_')[2];    

    this.bankAccountService
      .getUnUsedChequeDetails(this.unUsedCheque)
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.unUsedChequeList =
            response.Result as IUnUsedChequeDetailResponse[];
        } else if (response.Status === 'UNAUTH') {
          this.loginUser.logout();
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.positivePayRequest.BranchId = this.branchId;
    this.positivePayRequest.AccountNo = this.accountNumber;
    this.positivePayRequest.InstNo = this.f.ddlUnusedCheque.value;
    this.positivePayRequest.InstAmt = this.f.txtAmount.value;
    this.positivePayRequest.StartDate = this.formatDate(this.f.txtStartDate.value);
    this.positivePayRequest.ExpDate = this.formatDate(this.f.txtExpiaryDate.value);
    this.positivePayRequest.BeneficiaryName = this.f.txtBeneficiaryName.value;
    this.positivePayRequest.BrmProdId = '';    
    this.positivePayRequest.TPIN = '';
    this.positivePayRequest.OTP = '';
    
    this.requestService
      .sendPositivePayRequest(this.positivePayRequest)
      .subscribe((response) => {
        if (response.Status == 'OK') {          
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if(response.Status === 'OTP') {
          this.otpComponentShow = true;
        } else {         
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loading = false;
      });
  }

  setOtp(otp: string) {
    this.otp = otp;
  }

  submitOtp() {
    this.loading = true;

    this.positivePayRequest.OTP = this.otp;

    this.requestService
      .sendPositivePayRequest(this.positivePayRequest)
      .subscribe((Response) => {        
        if (Response.Status == 'OK') {
          this.loading = false;
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.otpComponentShow = false;
          this.onReset();
        } else if (Response.Status === 'UNAUTH') {
          this.loginUser.logout();
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
  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  backClick() {
    this.otpComponentShow = false;
  }

  onReset() {
    this.submitted = false;
    this.positivePayRequestForm.reset();
    this.f.ddlAccountNumber.setValue('');
    this.f.ddlChequeBook.setValue('');
    this.f.ddlUnusedCheque.setValue('');
    
    this.AmountInWords = ''
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  getAmountInWords(event: any) {    
    if (event.target.value == '') {
      this.AmountInWords = '';
    } else {
      this.AmountInWords = converter.toWords(event.target.value);      
    }
  }
}
