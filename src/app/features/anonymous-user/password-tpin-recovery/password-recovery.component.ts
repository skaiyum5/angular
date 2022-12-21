import { Component, OnInit } from '@angular/core';
import { IPasswordOrTpinRecovery } from '../../../models/login_credentials.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginCredentialService } from '../../../services/login_credentials.service';
import { AppConfigService } from '../../../services/appconfig.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import {
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { UserLoginComponent } from '../../user-login/user-login.component';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { BankAccountService } from '../../../services/bankaccount.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class PasswordRecoveryComponent implements OnInit {

  recoveryForm: UntypedFormGroup;
  forgetPasswordOrTpin: IPasswordOrTpinRecovery = {};
  homeBankBranchList: IHomeBranchInfoResponse[];
  title: string = '';

  today = this.calendar.getToday();
  minDate = { year: this.today.year - 100, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  isAutoGeneratePassword: boolean = true;

  submitted = false;
  loading = false;
  forTpin = false;
  forPassword = false;
  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  otpComponentShow = false;
  otp = '';

  otpSubmit: Function;
  goBack: Function;
  isChangeComplete: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private loginCredentialService: LoginCredentialService,
    private appConfigService: AppConfigService,
    private loginUser: AuthenticationService,
    private router: Router,
    private datepipe: DatePipe,
    private calendar: NgbCalendar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getKeyValueFromAppSettings('AUTO_GENARATED_PASSWORD_TPIN');
    this.getBranchList();

    this.recoveryForm = this.formBuilder.group({
      txtUserID: ['', Validators.required],
      txtEmail: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      txtBirthDate: ['', Validators.required],
      ddlBranch: ['', Validators.required],
      txtSearchValue: [''],
      txtAccountNo: ['', [Validators.required, Validators.pattern('[0-9]+'),Validators.maxLength(15)]],
      txtNewPassword: [''],
    });

    this.otpSubmit = this.onOtpSubmit.bind(this);
    this.goBack = this.backClick.bind(this);

    const routes: Routes = [
      { path: 'login', component: UserLoginComponent },
    ];
    this.route.params.subscribe(p => {
      if (p['key'] == 'password') {
        this.title = 'User Password Recovery';
        this.forPassword = true;

      } else if (p['key'] == 'tpin') {
        this.title = 'User T-PIN Create/Recovery';
        this.forTpin = true;
      }
      console.log(p['key'])

    });
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
    return this.recoveryForm.controls;
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  onCloseModal(close: boolean) {
    this.popup = close;

    if (this.isChangeComplete) {
      this.router.navigate(['login']);
    }
  }

  onReset() {
    this.submitted = false;
    this.recoveryForm.reset();
  }

  getKeyValueFromAppSettings(key: string) {
    this.appConfigService.getAppSettingsByKey(key)?.subscribe((Response) => {
      if (Response.Status == 'OK') {
        // Show New Passord Input Field if 'AUTO_GENARATED_PASSWORD_TPIN = false'
        this.isAutoGeneratePassword = Response.Result == 'TRUE' ? true : false;
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
        this.isAutoGeneratePassword = true;
      }
    });
  }

  backClick() {
    this.otpComponentShow = false;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.forgetPasswordOrTpin.USERNAME = this.f.txtUserID.value;
    this.forgetPasswordOrTpin.EMAIL = this.f.txtEmail.value;
    this.forgetPasswordOrTpin.BIRTH_DATE = this.formatDate(this.f.txtBirthDate.value);
    this.forgetPasswordOrTpin.BRANCH_ID = this.f.ddlBranch.value;
    this.forgetPasswordOrTpin.ACCOUNT_NUMBER = this.f.txtAccountNo.value;
    if (this.isAutoGeneratePassword) {
      this.forgetPasswordOrTpin.NEW_PASSWORD_OR_TPIN = '';
    }
    else {
      this.forgetPasswordOrTpin.NEW_PASSWORD_OR_TPIN = this.f.txtNewPassword.value;
    }
    this.forgetPasswordOrTpin.OTP = '';

    if(this.forTpin){
      this.loginCredentialService
      .TPinRecovery(this.forgetPasswordOrTpin)
      .subscribe((response) => {
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'OTP') {
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
    if(this.forPassword){
      this.loginCredentialService
      .PasswordRecovery(this.forgetPasswordOrTpin)
      .subscribe((response) => {
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'OTP') {
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

  }

  setOtp(otp: string) {
    this.otp = otp;
  }

  onOtpSubmit() {
    this.loading = true;

    this.forgetPasswordOrTpin.OTP = this.otp;

    if(this.forTpin){
      this.loginCredentialService
      .TPinRecovery(this.forgetPasswordOrTpin)
      .subscribe((response) => {
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'OTP') {
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
    if(this.forPassword){
      this.loginCredentialService
        .PasswordRecovery(this.forgetPasswordOrTpin)
        .subscribe((response) => {
          if (response.Status == 'OK') {
            this.popupError = false;
            this.header = 'Success';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.otpComponentShow = false;
            this.isChangeComplete = true;
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.isChangeComplete = false;
          }
          this.loading = false;
        });

    }
  }
}
