import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAccountBalanceResponse } from 'src/app/models/account_balance.model';
import { IAccountListResponse } from 'src/app/models/account_list.model';
import { IUtilitybillpayment } from 'src/app/models/utilitybillpayment.model';
import { ISimOfferDetails } from 'src/app/models/topup_simofferdetails.model';
import { BankAccountService } from 'src/app/services/bankaccount.service';
import { UtilitybillService } from 'src/app/services/utilitybill.service';
import * as converter from 'number-to-words';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { ActivityType } from 'src/app/models/app_enum.model';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css'],
})
export class TopupComponent implements OnInit {
  topUpForm: UntypedFormGroup;
  userAccountList: IAccountListResponse[];
  topUpPayment: IUtilitybillpayment = {
    ownBankCreditCardDetails: undefined
  };
  accountBalanceResult: IAccountBalanceResponse = {};
  simOfferList: ISimOfferDetails[];
  activityType = ActivityType;

  balanceInWords = '';
  topupAmountInWords = '';

  operator = '';

  branchId: string;
  accountNumber: string;

  topupAmounts = ['20', '50', '100', '150'];

  submitted = false;
  loading = false;

  // popup property
  popup: boolean = false;
  infoPopup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  otpComponentShow = false;

  otp = '';

  otpSubmit: Function;
  goBack: Function;

  // logo images
  gpLogo: string = `assets/icons/Topup/Grameenphone.jpg`;
  blLogo: string = `assets/icons/Topup/Banglalink.jpg`;
  robiLogo: string = `assets/icons/Topup/Robi.jpg`;
  teletalkLogo: string = `assets/icons/Topup/Teletalk.jpg`;
  airtelLogo: string = `assets/icons/Topup/Airtel.jpg`;

  offerOperatorLogo: string = '';
  offerOperatorTitle: string = '';
  isSimOfferAvailable: boolean = false;

  // ux
  gotAcc = false;

  tpin: string='';
  title: string='';
  forTpin: boolean=false;
  isTpinEnable: boolean=false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private utilityBillService: UtilitybillService,
    private bankAccountService: BankAccountService,
    private authenticationService: AuthenticationService,
    private userActivityService: UseractivityService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.userAccounts.Result;
    });
    this.topUpForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      mobileOperator: ['', [Validators.required]],
      accountNumber: ['', Validators.required],
      txtSearchValue: [''],
      amount: ['', [Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
      simType: ['Prepaid'],
    });

    this.otpSubmit = this.onOtpSubmit.bind(this);
    this.goBack = this.backClick.bind(this);
    this.isTpinEnable=this.authenticationService.currentUserValue.isTPINMendatory;

    // Activity Log
    // this.userActivityService.addNewActivity('entered topup page.', 'Entered Topup Page', this.activityType.TOPUP).subscribe(response => {});
    this.accountBalanceResult.availablE_BALANCE='NaN';
  }

  get f() {
    return this.topUpForm.controls;
  }

  selectOperator(name: string) {
    this.operator = name;
    this.f.mobileOperator.setValue(name);
    this.getSimOffer();
  }

  changeOperator() {
    this.operator = '';
    this.f.mobileOperator.setValue('');
    this.onReset()
  }

  selectSimType(type: string) {
    this.f.simType.setValue(type);
    this.getSimOffer();
  }

  getAccount(event: any) {
    //var acc = event.target.value.split('_');
    var acc = event.value.split('_');

    if(acc == '')
    {
      this.gotAcc = false;
      return;
    }
    
    this.branchId = acc[0];
    this.accountNumber = acc[1];
   
    this.bankAccountService
      .getAccountBalance(this.branchId, this.accountNumber)
      .subscribe((Response) => {        
        if (Response.Status == 'OK') {
          this.accountBalanceResult = Response.Result;
          this.getAvailableBalanceInWords(
            this.accountBalanceResult.availablE_BALANCE
          );
          this.gotAcc = true;
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {          
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account Balance Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getSimOffer() {

    this.isSimOfferAvailable = false;

    if(this.operator == '' || this.f.simType.value == '')
    {
      return;
    }
   
    // Operator logo and title
    this.offerOperatorTitle = this.operator;

    if(this.operator == 'Grameenphone')
    {
      this.offerOperatorLogo = this.gpLogo;      
    }
    else if(this.operator == 'Banglalink')
    {
      this.offerOperatorLogo = this.blLogo;      
    }
    else if(this.operator == 'Robi')
    {
      this.offerOperatorLogo = this.robiLogo;      
    }
    else if(this.operator == 'TeleTalk')
    {
      this.offerOperatorLogo = this.teletalkLogo;      
    }
    else if(this.operator == 'Airtel')
    {
      this.offerOperatorLogo = this.airtelLogo;      
    }

    this.utilityBillService
      .getSimOfferDetails(this.operator, this.f.simType.value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.simOfferList = Response.Result as ISimOfferDetails[]; 

          if(this.simOfferList?.length == 0)
          {            
            this.header = 'Recharge Offer';
            this.message = 'No Offers Available Right Now';
            this.btnText = 'Close';
            this.infoPopup = true;
          }
          else
          {
            this.isSimOfferAvailable = true;
          }

        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.header = 'Recharge Offer';
          this.message = 'No Offers Available Right Now';
          this.btnText = 'Close';
          this.infoPopup = true;
        }
      });
  }

  getAvailableBalanceInWords(availableBalance: string) {
    this.balanceInWords = converter.toWords(availableBalance);
  }

  setAmount(value: string) {
    this.f.amount.setValue(value);
    this.topupAmountInWords = converter.toWords(value);
  }

  getTransferAmountInWords(event: any) {    
    if (event.target.value == '') {
      this.topupAmountInWords = '';
    } else {
      this.topupAmountInWords = converter.toWords(event.target.value);
    }
  }


  onSubmit() {
    this.submitted = true;
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined)&& this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.otpComponentShow=true;
      this.forTpin = true;
      return;
    }
    this.loading = true;

    this.topUpPayment.utilityServiceBillType = 'SSLTOPUP';
    this.topUpPayment.transactionSourceId = this.branchId;
    this.topUpPayment.comments = 'mobile recharge';
    this.topUpPayment.billNumber = this.f.mobileNumber.value;
    this.topUpPayment.billamount = this.f.amount.value;
    this.topUpPayment.billAccountNumber = this.accountNumber;
    this.topUpPayment.billMobileNumber = this.f.mobileNumber.value;
    this.topUpPayment.billCategory = this.f.simType.value;
    this.topUpPayment.operatorId = this.f.mobileOperator.value;
    this.topUpPayment.customerid = '';
    this.topUpPayment.paymentBranchId = this.branchId;
    this.topUpPayment.paymentAccountNumber = this.accountNumber;
    this.topUpPayment.TPIN = this.tpin;
    this.topUpPayment.OTP = '';

    this.utilityBillService
      .saveTopUp(this.topUpPayment)
      .subscribe((response) => {       
        if (response.Status == 'OK') { 
          this.loading=false;         
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if(response.Status === 'OTP') {
          this.otpComponentShow = true;
          this.loading=false; 
          this.tpin='';
          this.forTpin=false;
          this.title='';
        } else {          
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.forTpin=true;
        }
        this.loading = false;
      });
  }

  setOtp(otp: string) {
    if (this.forTpin) {
      this.tpin = otp;
    } else {
      this.otp = otp;
    }
  }

  onOtpSubmit() {
    if (this.forTpin) {
      this.loading = true;
      this.onSubmit();
      this.forTpin = false;
      return;
    }
    this.loading = true;

    this.topUpPayment.OTP = this.otp;

    this.utilityBillService
      .saveTopUp(this.topUpPayment)
      .subscribe((response) => {        
        if (response.Status == 'OK') {
          this.onReset();
          this.loading=false; 
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message + '. Transaction ID - ' + response.Result;;
          this.btnText = 'Close';
          this.popup = true;
          this.otpComponentShow = false;
          this.tpin='';
            this.title='';
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

  backClick() {
    this.otpComponentShow = false;
  }

  onReset() {
    this.submitted = false;
    this.topUpForm.reset();
    this.f.simType.setValue('Prepaid');
    this.f.mobileOperator.setValue('');
    this.f.accountNumber.setValue('');
    // this.f.amount.setValue('');
    this.operator = '';
    this.gotAcc = false;
    this.accountBalanceResult.availablE_BALANCE = 'NaN';
    this.balanceInWords = ''
    this.simOfferList = [];
  }

  onCloseModal(close: boolean) {
    this.popup = close;
    this.infoPopup = close;
  }

  // getIPAddress()  
  // {  
  //   this.ip.getIPAddress().subscribe((res:any)=>{  
  //     this.ipAddress = "IBU-"+res.ip;
  //   });    
  // }
}
