import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.css']
})
export class ConfirmOtpComponent implements OnInit {
  @Input() onSubmit: Function;
  @Input() goBack: Function;
  @Input() isRegisterComponent: boolean = false;
  @Input() title?: string="";
  @Output() otpEmitter = new EventEmitter<string>();
  @ViewChild("otpForm")
  otpForm: NgForm;
  backBtnVisible = false;
  otp: string;
  auth2FAProvider: string;
  securityCodeTitle: string;

  constructor(private loginUser: AuthenticationService) { }

  ngOnInit() {
    this.changeSecurityCodeTitle();
  }
  ngOnChanges(changes: SimpleChanges) {
    
    console.log(changes);
    this.changeSecurityCodeTitle() ;
    this.otp='';
    this.otpForm?.reset();
  this.otpForm?.resetForm();

  }
  setOtp(event: any) {
    this.otpEmitter.emit(event.target.value.trim());
  }

  submitOtp(): void {
    this.onSubmit();
  }

  toggleBackBtnVisibility(visible: boolean) {
    this.backBtnVisible = visible
  }

  backClick() {
    this.goBack();
  }

  changeSecurityCodeTitle() {
    if(this.title.length>0 || this.title !=""){
      this.securityCodeTitle=this.title;
      return;
    }
    if (this.loginUser.currentUserValue != null)
      this.auth2FAProvider = this.loginUser.currentUserValue.auth2FAProvider;
    else
      this.auth2FAProvider = '';


    if (this.auth2FAProvider == "OTP" || this.auth2FAProvider == "") {
      this.securityCodeTitle = 'Please enter your OTP.';
    }
    else if (this.auth2FAProvider == "2FA") {
      this.securityCodeTitle = 'Please enter your 2FA token.';
    }
    else {
      this.securityCodeTitle = 'Please enter you Security Code.';
    }
  }

}
