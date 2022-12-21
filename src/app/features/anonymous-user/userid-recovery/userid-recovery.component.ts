import { Component, OnInit } from '@angular/core';
import { IUserIDRecovery } from '../../../models/login_credentials.model';
import { LoginCredentialService } from '../../../services/login_credentials.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import {
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { UserLoginComponent } from '../../user-login/user-login.component';
import { BankAccountService } from '../../../services/bankaccount.service';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';

@Component({
  selector: 'app-userid-recovery',
  templateUrl: './userid-recovery.component.html',
  styleUrls: ['./userid-recovery.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class UserIDRecoveryComponent implements OnInit {

  UserIDRecoveryForm: UntypedFormGroup;
  recoverUserID: IUserIDRecovery = {};
  homeBankBranchList: IHomeBranchInfoResponse[];

  today = this.calendar.getToday();
  minDate = { year: this.today.year - 100, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  isAutoGeneratePassword: boolean = true;

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

  otpSubmit: Function;
  goBack: Function;
  isPasswordChangeComplete: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private loginCredentialService: LoginCredentialService,
    private router: Router,
    private datepipe: DatePipe,
    private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.getBranchList();

    this.UserIDRecoveryForm = this.formBuilder.group({
      ddlBranch: ['', Validators.required],
      txtSearchValue: [''],
      txtAccountNo: ['', [Validators.required, Validators.minLength(11)]],
      txtEmail: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      txtMobileNo: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(11)]],
      txtBirthDate: ['', Validators.required],
    });

    this.otpSubmit = this.onOtpSubmit.bind(this);
    this.goBack = this.backClick.bind(this);

    const routes: Routes = [
      { path: 'login', component: UserLoginComponent },
    ];
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
    return this.UserIDRecoveryForm.controls;
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  onCloseModal(close: boolean) {
    this.popup = close;

    if (this.isPasswordChangeComplete) {
      this.router.navigate(['login']);
    }
  }

  onReset() {
    this.submitted = false;
    this.UserIDRecoveryForm.reset();
  }

  backClick() {
    this.otpComponentShow = false;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.recoverUserID.BRANCH_ID = this.f.ddlBranch.value;
    this.recoverUserID.ACCOUNT_NUMBER = this.f.txtAccountNo.value;
    this.recoverUserID.EMAIL = this.f.txtEmail.value;
    this.recoverUserID.MOBILE = this.f.txtMobileNo.value;
    this.recoverUserID.BIRTH_DATE = this.formatDate(this.f.txtBirthDate.value);
    this.recoverUserID.OTP = '';

    this.loginCredentialService
      .UserIDRecovery(this.recoverUserID)
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

  setOtp(otp: string) {
    this.otp = otp;
  }

  onOtpSubmit() {
    this.loading = true;

    this.recoverUserID.OTP = this.otp;

    this.loginCredentialService
      .UserIDRecovery(this.recoverUserID)
      .subscribe((response) => {        
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.otpComponentShow = false;
          this.isPasswordChangeComplete = true;
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.isPasswordChangeComplete = false;
        }
        this.loading = false;
      });
  }
}
