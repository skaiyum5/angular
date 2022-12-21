import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IPasswordChange } from '../../../models/login_credentials.model';
import { LoginCredentialService } from '../../../services/login_credentials.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ConfirmedValidator } from '../../../helpers/confirmed.validator';
import { Router } from '@angular/router';
import { ActivityType } from 'src/app/models/app_enum.model';
import { UseractivityService } from 'src/app/services/useractivity.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordChange: IPasswordChange = {};
  passwordChangeForm: UntypedFormGroup;
  submitted = false;
  isDisabled = true;

  oldPasswordVisible = false;
  newPasswordVisible = false;
  passConfirmVisible = false;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passwordChangeForm = this.formBuilder.group(
      {
        txtUserName: [''],
        txtOldPassword: ['', Validators.required],
        txtNewPassword: ['', Validators.required],
        txtConfirmNewPassword: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator(
          'txtNewPassword',
          'txtConfirmNewPassword'
        ),
      } as AbstractControlOptions
    );

    this.f.txtUserName.setValue(this.loginUser.currentUserValue.userName);
  }

  get f() {
    return this.passwordChangeForm.controls;
  }

  changePasswordRequest() {
    this.submitted = true;

    // // stop here if form is invalid
    if (this.passwordChangeForm.invalid) {
       // Activity Log
       this.userActivityService.addNewActivity('Change Password', this.activityType.REGISTER,'Trying to change password').subscribe(response => {});

      return;
    }

    this.passwordChange.userName = this.f.txtUserName.value;
    this.passwordChange.oldPassword = this.f.txtOldPassword.value;
    this.passwordChange.newPassword = this.f.txtNewPassword.value;
    this.passwordChange.confirmPassword = this.f.txtConfirmNewPassword.value;

    this.loginCredentialService
      .changePassword(this.passwordChange)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = `Loggin Out... (${this.countDown})`;
          this.btnDisabled = true;
          this.popup = true;
          setInterval(() => {
            if(this.countDown > 0) {
              this.countDown = this.countDown - 1;
              this.btnText = `Loggin Out... (${this.countDown})`;
            }
          }, 1000)
          setTimeout(() => {
            this.loginUser.logout();
            this.router.navigate(['/login']);
          }, 5000);
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
    this.oldPasswordVisible = !this.oldPasswordVisible;
  }

  showNewPassword() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  showPassConfirm() {
    this.passConfirmVisible = !this.passConfirmVisible;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
