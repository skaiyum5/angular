import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ITpinChange } from '../../../models/login_credentials.model';
import { LoginCredentialService } from '../../../services/login_credentials.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ConfirmedValidator } from '../../../helpers/confirmed.validator';
import { Router } from '@angular/router';
import { ActivityType } from 'src/app/models/app_enum.model';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { AppConfigService } from 'src/app/services/appconfig.service';

@Component({
  selector: 'app-change-Tpin',
  templateUrl: './change-Tpin.component.html',
  styleUrls: ['./change-Tpin.component.css'],
})
export class ChangeTpinComponent implements OnInit {
  tPinChange: ITpinChange = {};
  tPinChangeForm: UntypedFormGroup;

  submitted = false;
  isDisabled = true;

  oldTpinVisible = false;
  newTpinVisible = false;
  tPinConfirmVisible = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  btnDisabled = false;

  countDown = 5;

  activityType = ActivityType;
  constructor(private userActivityService: UseractivityService,
    private formBuilder: UntypedFormBuilder,
    private loginCredentialService: LoginCredentialService,
    private loginUser: AuthenticationService,
    private router: Router,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.tPinChangeForm = this.formBuilder.group(
      {
        txtUserName: [''],
        txtOldTpin: ['', Validators.required],
        txtNewTpin: ['', Validators.required],
        txtConfirmNewTpin: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator(
          'txtNewTpin',
          'txtConfirmNewTpin'
        ),
      } as AbstractControlOptions
    );

    this.f.txtUserName.setValue(this.loginUser.currentUserValue.userName);
  }

  get f() {
    return this.tPinChangeForm.controls;
  }

  changePasswordRequest() {
    this.submitted = true;

    // // stop here if form is invalid
    if (this.tPinChangeForm.invalid) {
      // Activity Log
      this.userActivityService.addNewActivity('Change Password', this.activityType.REGISTER, 'Trying to change password').subscribe(response => { });

      return;
    }

    this.tPinChange.userName = this.f.txtUserName.value;
    this.tPinChange.oldTpin = this.f.txtOldTpin.value;
    this.tPinChange.newTpin = this.f.txtNewTpin.value;
    this.tPinChange.confirmTpin = this.f.txtConfirmNewTpin.value;

    this.loginCredentialService
      .changePin(this.tPinChange)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {


          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          // this.btnText = `Loggin Out... (${this.countDown})`;
          this.btnText = 'OK';
          this.btnDisabled = true;
          this.popup = true;
          this.appConfigService.getAppSettingsByKey("LOGIN_AFTER_TPIN_VERIFICATION").subscribe(x => {
            
            if (x.Result=='TRUE') {
              setInterval(() => {
                if (this.countDown > 0) {
                  this.countDown = this.countDown - 1;
                  this.btnText = `Loggin Out... (${this.countDown})`;
                }
              }, 1000)
              setTimeout(() => {
                this.loginUser.logout();
                this.router.navigate(['/login']);
              }, 5000);
            }else{
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 3000);
            }
          })
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Try Again';
          this.popup = true;
        }
      });
  }

  showOldPassword() {
    this.oldTpinVisible = !this.oldTpinVisible;
  }

  showNewPassword() {
    this.newTpinVisible = !this.newTpinVisible;
  }

  showPassConfirm() {
    this.tPinConfirmVisible = !this.tPinConfirmVisible;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
