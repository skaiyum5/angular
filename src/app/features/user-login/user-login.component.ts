import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { IpServiceService } from '../../services/ip-service.service';
import { BankInfoService } from 'src/app/services/bankInfo.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserLoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  passwordVisibility = false;
  usernameVisibility = false;
  returnUrl: string = '';
  error = '';
  otp: any;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  isValidUser: boolean = false;

  loginWebImage: string = `assets/images/MicrosoftTeams-image.png`;
  loginMobileImage: string = `assets/images/logo-mob.jpg`;
  loginBackgroundImage: string = `assets/images/Login_Background.png`;

 //Mobile regulation PopUp
  appDownloadUrl:string="https://play.google.com/store/apps";
  appIconUrl:string="assets/images/Google-Play-icon.jpg";

  // ux
  //usernameProvided = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private ip:IpServiceService,
    private bankInfoService:BankInfoService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUser) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.getIPAddress();
    this.getbankContactInfo();
  }

  ipAddress:string;
  getIPAddress()
  {
    this.ip.getIPAddress().subscribe((res:any)=>{
      this.ipAddress = "IBU-"+res.ip;
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  // checkIsValidUserID() {
  //   this.loading = true;
  //   this.authenticationService
  //     .isValidUserID(this.f.username.value)
  //     .subscribe((Response) => {
  //       console.log(Response);
  //       if (Response.Result == true) {
  //         this.loading = false;
  //         this.usernameProvided = true;
  //       } else {
  //         this.loading = false;
  //         this.popupError = true;
  //         this.header = 'Failure';
  //         this.message = 'Invalid User';
  //         this.btnText = 'Close';
  //         this.popup = true;
  //         this.usernameProvided = false;
  //       }
  //     });
  // }

  onSubmit() {
    // if (!this.usernameProvided && this.f.username.value !== '') {
    //   this.submitted = false;
    //   this.checkIsValidUserID();
    //   return;
    // } else if (!this.usernameProvided && this.f.username.value === '') {
    //   this.submitted = true;
    //   return;
    // } else if (this.usernameProvided && this.f.password.value === '') {
    //   this.submitted = true;
    //   return;
    // }
    if(!this.loginForm.valid){
      return this.loginForm.markAllAsTouched();
    }
    this.loading = true;

    this.authenticationService
      .login(this.f.username.value.trim(), this.f.password.value.trim(), this.ipAddress)
      //.pipe(first())
      .subscribe(
        (data) => {
          if (data.Status !== 'OK') {
            this.loading = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = data.Message;
            //this.message = "Invalid User ID/Password";
            this.btnText = 'Close';
            this.popup = true;
          }
          // Only Individual User Can Access This Portal
          if(data.Result.customerTypeID == "1" || data.Result.customerTypeNM == "Individual")
          {
            if (data.Result.isFirstLogin) {
              this.router.navigate(['/account/changepassword']);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          }
          else
          {
            this.authenticationService.logout();
            this.loading = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = "Sorry! You are not an individual user.";
            this.btnText = 'Close';
            this.popup = true;
          }
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  onReset(): void {
    this.submitted = false;
    //this.usernameProvided = false;
    this.loginForm.reset();
  }

  submitOtp(): void {}

  changePassVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  changeUsernameVisibility() {
    this.usernameVisibility = !this.usernameVisibility;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  //bankInfo
  localnum:string[]=[];
  internationalnum:string[]=[];
  mailAddress:string[]=[];
  officeAddress: string[]=[];

  getbankContactInfo(){
    this.bankInfoService.getbankContactInfo().subscribe((Response) =>{
     // Response.Result as IBankContact[];
     Response.Result.forEach(x=>
       {
         this.localnum.push(x.localNumber)
         this.internationalnum.push(x.international)
         this.mailAddress.push(x.mailAddress)
         this.officeAddress.push(x.officeAddress)
       })
    });

   }
}
