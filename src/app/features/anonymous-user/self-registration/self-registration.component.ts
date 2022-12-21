import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ISignup } from '../../../models/signup.model';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { SignupService } from '../../../services/signup.service';
import { AppConfigService } from '../../../services/appconfig.service';
import { BankAccountService } from '../../../services/bankaccount.service';
import { VerificationService } from '../../../services/verification.service';
import { Router, Routes } from '@angular/router';
import { NgbDateParserFormatter,  NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserLoginComponent } from '../../user-login/user-login.component';

@Component({
  selector: 'app-self-registration',
  templateUrl: './self-registration.component.html',
  styleUrls: ['./self-registration.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SelfRegistrationComponent implements OnInit {

  selfRegistrationForm: UntypedFormGroup;
  homeBankBranchList: IHomeBranchInfoResponse[];
  signup: ISignup = {};

  today = this.calendar.getToday();
  minDate = { year: this.today.year - 100, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  submitted = false;
  loading = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  otpComponentShow = false;
  otp = '';

  mobileNo:string = '';
  branchID:string = '';
  branchName:string = '';
  accountNo:string = '';

  otpSubmit: Function;
  goBack: Function;

  isAutoGenerateUserID: boolean = true;
  isRegistrationComplete: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private signUpService: SignupService,
    private appConfigService: AppConfigService,
    private verificationService: VerificationService,
    private router: Router,
    private datepipe: DatePipe,
    private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.getKeyValueFromAppSettings('AUTO_SET_USER_ID_AT_SIGNUP');
    this.getBranchList();

    this.selfRegistrationForm = this.formBuilder.group({
      txtUserID: [''],
      ddlBranch: ['', Validators.required],
      txtSearchValue : [''],
      txtAccountNo: ['', [Validators.required, Validators.pattern('[0-9]+'),Validators.maxLength(11)]],
      txtAccountTitle: ['', Validators.required],
      txtMobileNo: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(11)]],
      txtEmail: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      txtBirthDate: ['', Validators.required],
    });
    this.otpSubmit = this.onSubmit.bind(this);
    this.goBack = this.backClick.bind(this);

    const routes: Routes = [
      { path: 'login', component: UserLoginComponent },
    ];

    if (window.innerWidth <= 768 || window.innerHeight < 100) {
      this.isMobileScreen=true
    }
  }

  getBranchList() {
    this.bankAccountService.getHomeBankBranchList('0').subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.homeBankBranchList = Response.Result as IHomeBranchInfoResponse[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Branch Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  get f() {
    return this.selfRegistrationForm.controls;
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  onCloseModal(close: boolean) {
    this.popup = close;

    if (this.isRegistrationComplete) {
      this.router.navigate(['login']);
    }
  }

  onReset() {
    this.submitted = false;
    this.selfRegistrationForm.reset();
  }

  onSubmit() {
    this.mobileNo = this.f.txtMobileNo.value;
    this.branchID = this.f.ddlBranch.value,
    this.accountNo = this.f.txtAccountNo.value;

    this.verificationService.verifyMobile(this.otp, this.mobileNo, this.branchID, this.accountNo).subscribe((Response) => {

      if (Response.Status == 'OK') {
        this.createUser();
      } else if(Response.Status == 'OTP')
      {
        this.otpComponentShow = true;
      }
      else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getKeyValueFromAppSettings(key:string) {
    this.appConfigService.getAppSettingsByKey(key)?.subscribe((Response) => {
      if (Response.Status == 'OK') {
        // Show User ID Input Field if 'AUTO_SET_USER_ID_AT_SIGNUP = false'
        this.isAutoGenerateUserID = Response.Result == 'TRUE' ? true : false;
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
        this.isAutoGenerateUserID = true;
      }
    });
  }

  backClick() {
    this.otpComponentShow = false;
  }

  createUser() {
    this.submitted = true;
    this.loading = true;

    if (this.isAutoGenerateUserID) {
      this.signup.UserID = '';
    }
    else {
      this.signup.UserID = this.f.txtUserID.value;
    }
    this.signup.BranchName = this.branchName;
    this.signup.AccountNo = this.f.txtAccountNo.value;
    this.signup.AccountTitle = this.f.txtAccountTitle.value;
    this.signup.BranchId = this.f.ddlBranch.value;
    this.signup.AccountAddressTypeId = '1';
    this.signup.PhoneNumber = this.f.txtMobileNo.value;
    this.signup.Email = this.f.txtEmail.value;
    this.signup.DOB = this.formatDate(this.f.txtBirthDate.value);
    this.signup.ChannelName = 'IBU';

    this.signUpService
      .sendSignUpRequest(this.signup)
      .subscribe((response) => {
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.otpComponentShow = false;
          this.isRegistrationComplete = true;
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.isRegistrationComplete = false;
        }
        this.loading = false;
      });
  }

  setOtp(otp: string) {
    this.otp = otp;
  }

  getBranchName(event:any)
  {
    //this.branchName = event.target.options[event.target.selectedIndex].text;
    this.branchName = event.source.selected.viewValue;
  }
  isMobileScreen=false;
  imageUrl:string="assets/images/cheque.jpeg";
  isOnClick=false;
  showExample(){
    this.isOnClick=!this.isOnClick;
  }
  // onOtpSubmit() {
  //   this.loading = true;

  //   //this.signup.OTP = this.otp;

  //   this.signUpService
  //     .sendSignUpRequest(this.signup)
  //     .subscribe((response) => {
  //       console.log(response);
  //       if (response.Status == 'OK') {
  //         this.popupError = false;
  //         this.header = 'Success';
  //         this.message = response.Message;
  //         this.btnText = 'Close';
  //         this.popup = true;
  //         this.otpComponentShow = false;
  //         this.isRegistrationChangeComplete = true;
  //       } else {
  //         this.popupError = true;
  //         this.header = 'Failure';
  //         this.message = response.Message;
  //         this.btnText = 'Close';
  //         this.popup = true;
  //         this.isRegistrationChangeComplete = false;
  //       }
  //       this.loading = false;
  //     });
  // }
}
