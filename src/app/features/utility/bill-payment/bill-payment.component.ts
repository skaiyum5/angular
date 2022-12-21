import { Component, OnInit } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { IAccountBalanceResponse } from '../../../models/account_balance.model';
import { IUtilitybillpayment } from '../../../models/utilitybillpayment.model';
import { IUtilitybillVendorResponse } from 'src/app/models/utilityvendor.model';
import { IBillZoneResponse } from 'src/app/models/utilitybillvendorzone.model';

import { BankAccountService } from '../../../services/bankaccount.service';
import { UtilitybillService } from '../../../services/utilitybill.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as converter from 'number-to-words';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { IUtilityBillCategoryResponse } from 'src/app/models/utilitybillcategory.model';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { AccountType } from 'src/app/models/app_enum.model';
import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { IBeneficiary } from 'src/app/models/beneficiary.model';
import { IBankInfoResponse } from 'src/app/models/bank_bankinfo.model';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css'],
})
export class BillPaymentComponent implements OnInit {
  billPaymentForm: UntypedFormGroup;
  beneficiaryList: IBeneficiary[];
  userAccountList: IAccountListResponse[];
  vendorList: IUtilitybillVendorResponse[] = [];
  tempVendorList: IUtilitybillVendorResponse[] = [];
  zoneList: IBillZoneResponse[];
  billCategoryList: IUtilityBillCategoryResponse[];
  accountBalanceResult: IAccountBalanceResponse = { availablE_BALANCE: '' };
  billPayment: IUtilitybillpayment = { ownBankCreditCardDetails: undefined };
  vendor: IUtilitybillVendorResponse = {};
  accountType = AccountType;

  fromBranchId: string = '';
  fromAccountNumber: string = '';
  billZone: string = '';
  selectedItem: string = '';
  AvailableBalanceInWords: string = '';
  BillAmountInWords: string = '';
  PayeeAccountTitle: string = '';

  isComponentShow: boolean = true;
  isOtpShow: boolean = false;
  otp: any;
  submitted = false;
  loading = false;

  // popup property
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  popup: boolean = false;

  isShowBillAmountField: boolean = false;
  isShowBillZoneAndMonth: boolean = false;
  isShowBillNumber: boolean = false;
  isShowBillAccountNumber: boolean = false;
  isNSUBill: boolean = false;
  isShowBGDCL: boolean = false;
  isShowCustomerName: boolean = false;
  isShowRequestId: boolean = false;
  isSchoolBankingBill: boolean = false;
  isNIDBill: boolean = false;
  isBtclBill: boolean = false;
  isHideBillAmountButton: boolean = false;
  isbeneficiaryRequired: boolean = false;


  billType: string = '';
  pvCode: string = '';
  billNumberLabelText: string = '';
  billAccountNumberLabelText: string = '';
  billZoneLabelText: string = '';
  billCategoryLabelText: string = '';
  customerNameLabelText: string = '';

  selectedYear: number;
  billMonths: string[] = [];
  billYears: number[] = [];

  transferAmounts = ['500', '1000', '2000', '5000'];

  billProvider: string = '';

  tpin: string = '';
  title: string = '';
  forTpin: boolean = false;
  // ux
  gotAcc = false;

  isDisplayFuture: boolean = true;
  isDisplayFutureMessage: boolean = false;
  isTpinEnable: boolean = false;

  // MFS (Bkash/Nagad)
  isMfsToAccProvided = false;
  selectedCardNumber: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private utilityBillService: UtilitybillService,
    private loginUser: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private userActivityService: UseractivityService
  ) {
    //Bill Year
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear - 20; year <= this.selectedYear; year++) {
      this.billYears.push(year);
    }
  }

  ngOnInit(): void {

    this.getAccountList(this.accountType.FundTransfer.toString());
    this.getUtilityBillVendorList();

    var currentMonth =
      (new Date().getMonth() + 1).toString().length > 1
        ? new Date().getMonth() + 1
        : '0' + (new Date().getMonth() + 1);
    var currentYear = new Date().getFullYear();

    this.billPaymentForm = this.formBuilder.group({
      ddlPayOutAccount: new UntypedFormControl('', Validators.required),
      txtSearchValue: new UntypedFormControl(''),
      //ddlVendor: new FormControl('', Validators.required),
      ddlBillZone: new UntypedFormControl(''),
      txtBillAccountNumber: new UntypedFormControl(''),
      txtBillNumber: new UntypedFormControl(''),
      ddlStudentBillType: new UntypedFormControl(''),
      ddlFromBillMonth: new UntypedFormControl(currentMonth),
      ddlFromBillYear: new UntypedFormControl(currentYear),
      ddlToBillMonth: new UntypedFormControl(currentMonth),
      ddlToBillYear: new UntypedFormControl(currentYear),
      txtCustomerId: new UntypedFormControl(''),
      ddlBillMonth: new UntypedFormControl(currentMonth),
      ddlBillYear: new UntypedFormControl(currentYear),
      ddlMFSBeneficiary: new UntypedFormControl(''),
      ddlBtclExchangeCode: new UntypedFormControl(''),
      txtBillAmount: [ '',[Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],],
      txtCustomerName: new UntypedFormControl(''),
      txtStudentID: new UntypedFormControl(''),
      txtStudentName: new UntypedFormControl(''),
      txtNationalID: new UntypedFormControl(''),
      ddlNidBillCategory: new UntypedFormControl(''),
      txtNsuBillCode: new UntypedFormControl(''),
      txtBtclNumber: new UntypedFormControl(''),
      mobileOperator: ['',],
      txtRequestId: [''],
      txtMfsReciverName:new UntypedFormControl(''),
      paymentBankId:new UntypedFormControl(''),
      txtSearchBank:new UntypedFormControl(''),
    });

    this.otpSubmit = this.submitOtp.bind(this);
    this.goBack = this.backClick.bind(this);
    this.isTpinEnable = this.loginUser.currentUserValue.isTPINMendatory;

    ddlMFSBeneficiary:[] =[]
    // this.route.queryParams
    //   .subscribe(params => {
    //     console.log(params.transferType);
    //     this.vendor = this.vendorList.filter(
    //       (v) => v.id === params.transferType
    //     )[0];

    //     if (this.vendor != null) {
    //       this.selectProvider(this.vendor);
    //     }
    //   }
    //   );

    // Activity Log
    //  this.userActivityService.addNewActivity('entered bill payment page.', 'Utility Bill Payment', this.activityType.BILLPAY).subscribe(response => {});
  }


  otherBankList: IBankInfoResponse[];
  // otpStatus: string = '';
  otpSubmit: Function;
  goBack: Function;

  setOtp(otp: string) {
    if (this.forTpin) {
      this.tpin = otp;
    } else {
      this.otp = otp;
      this.billPayment.OTP = otp;
    }
  }

  get f() {
    return this.billPaymentForm.controls;
  }

  months = [
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];


  //Load Account List
  getAccountList(nameValueList: string) {
    this.bankAccountService
      .getUserAccount(nameValueList)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.userAccountList = Response.Result as any[];
        } else {
          // alert('Account List Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // Provider/Vendor List
  getUtilityBillVendorList() {
    this.utilityBillService.getUtilityBillVendorList().subscribe((Response) => {
      console.log(Response)
      if (Response.Status == 'OK') {
        this.tempVendorList = Response.Result as IUtilitybillVendorResponse[];

        for (var index = 0; index < this.tempVendorList.length; index++) {
          if (this.tempVendorList[index].id == 'NESCOPOSTPAID') {
            this.tempVendorList[index].serial = 1;
            this.tempVendorList[index].logo = `assets/icons/Bill/NESCO.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'NESCOPREPAID') {
            this.tempVendorList[index].serial = 2;
            this.tempVendorList[index].logo = `assets/icons/Bill/NESCO.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'BREBPREPAID') {
            this.tempVendorList[index].serial = 3;
            this.tempVendorList[index].logo = `assets/icons/Bill/BREB.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'BREBPOSTICBS') {
            this.tempVendorList[index].serial = 4;
            this.tempVendorList[index].logo = `assets/icons/Bill/BREB.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          // else if (this.tempVendorList[index].id == 'RAJWASA') {
          //   this.tempVendorList[index].serial = 5;
          //   this.tempVendorList[index].logo = `assets/icons/Bill/RajshahiWasa.jpg`;
          //   this.vendorList.push(this.tempVendorList[index]);
          // }
          else if (this.tempVendorList[index].id == 'DHAKAWASA') {
            this.tempVendorList[index].serial = 6;
            this.tempVendorList[index].logo = `assets/icons/Bill/WASA.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'CREDITCARDBILLOWN') {
            this.tempVendorList[index].serial = 5;
            this.tempVendorList[index].logo = `assets/icons/Bill/OwnBankCard.png`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'CREDITCARDBILLOTHER') {
            this.tempVendorList[index].serial = 5;
            this.tempVendorList[index].logo = `assets/icons/Bill/CREDITCARD.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'DPDC') {
            this.tempVendorList[index].serial = 5;
            this.tempVendorList[index].logo = `assets/icons/Bill/DPDC.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
          else if (this.tempVendorList[index].id == 'DESCO') {
            this.tempVendorList[index].serial = 5;
            this.tempVendorList[index].logo = `assets/icons/Bill/DESCO.jpg`;
            this.vendorList.push(this.tempVendorList[index]);
          }
        }
        this.vendorList.sort((a, b) => (a.serial < b.serial ? -1 : 1));
        this.tempVendorList = [];
      }
      else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.vendor = this.vendorList.filter(
        (item) => item.id === params.transferType
      )[0];

      if (this.vendor != null) {
        this.selectProvider(this.vendor);
      }
    });
  }
 //EFT Bank
 getEFTBankList(value: string) {
  this.bankAccountService.getBankList(value).subscribe((Response) => {
    if (Response.Status == 'OK') {
      this.otherBankList = Response.Result as any[];
    } else {
      // alert('Bank Loading Failed');
      this.popupError = true;
      this.header = 'Failure';
      this.message = 'Bank Loading Failed';
      this.btnText = 'Close';
      this.popup = true;
    }
  });
}
  // Bill Zone
  getBillZoneList(nameValueList: string, pvCode: string) {
    this.utilityBillService
      .getBillZone(nameValueList, pvCode)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.zoneList = Response.Result as any[];
        } else {
          // alert('Bill Zone Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Bill Zone Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  backClick() {
    this.isOtpShow = false;
    this.isComponentShow = true;
    this.tpin = '';
    this.otp = '';
  }
  // Bill Category
  getUtilityBillCategoryList(pvCode: string) {
    this.utilityBillService
      .getUtilityBillCategory(pvCode)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.billCategoryList = Response.Result as any[];
        } else {
          // alert('Bill Category Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Bill Category Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // Available Balance and Account Title
  getAccountDetails(event: any) {
    // Available Balance
    var acc = event.value.split('_');
    this.fromBranchId = acc[0];
    this.fromAccountNumber = acc[1];

    // Account Title
    this.PayeeAccountTitle = acc[2];

    this.bankAccountService
      .getAccountBalance(this.fromBranchId, this.fromAccountNumber)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.accountBalanceResult = Response.Result;

          this.getAvailableBalanceInWords(
            this.accountBalanceResult.availablE_BALANCE
          );
          this.gotAcc = true;
        } else {
          // alert('Account Balance Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account Balance Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });

    //this.getBillDetails();
  }

  getBeneficiaryList(beneficiaryType: string) {
    this.beneficiaryService
      .getBeneficiary(beneficiaryType)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.beneficiaryList = Response.Result as any[];
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Beneficiary Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }
  // MFS Beneficiary
  populateMFSByBenificiary(event: any) {
    debugger
    console.log(event.source.selected.viewValue)
    if (event.source.selected.viewValue == null || event.source.selected.viewValue == '') {
      this.billPaymentForm.controls['txtBillNumber']?.setValue('');
      this.billPaymentForm.controls['txtMfsReciverName']?.setValue('');
      return;
    }
    let beneficiaryId = parseInt(event.value.split('-')[0]);
    console.log(beneficiaryId);
    let benificary = this.beneficiaryList.filter(
      (b) => b.beneficiaryId === beneficiaryId
    )[0];
    // let bank = this.npsbBankList.filter(
    //   (b) => b.acquirinG_BANK_CODE === benificary.toBankCode
    // )[0];
    // console.log(bank);
    // if (bank) {
    //   this.f.ddlNpsbReceiverType.setValue(
    //     benificary.receiverType === 'Account' ? 'A' : 'C'
    //   );
    //   this.provideNpsbRecType();
    //   this.f.ddlNpsbBankName.setValue(bank.acquirinG_BANK_CODE);
    //   this.provideNpsbBank();
    this.billPaymentForm.controls['txtBillNumber']?.setValue(benificary.toAccountNo);
    this.billPaymentForm.controls['txtMfsReciverName']?.setValue(benificary.receiverName);
    this.billPaymentForm.controls['paymentBankId']?.setValue(benificary.toBankCode);
    if(this.isCreditCard){
      this.selectedCardNumber=benificary.toAccountNo;
      this.billPaymentForm.controls['txtBillNumber']?.setValue(this.maskCharacter(benificary.toAccountNo));
    }
    if(this.billProvider === 'CREDITCARDBILLOWN'){ this.getBillDetails();}

    this.isMfsToAccProvided = true;
    //}
  }

  getTransferAmountInWords(event: any) {
    //console.log(event.target.value);
    if (event.target.value == '') {
      this.BillAmountInWords = '';
    } else {
      this.BillAmountInWords = converter.toWords(event.target.value);
    }
  }

  // Change UI By Provider/Vendor
  // changeUIByVendor(event: any) {
  changeUIByVendor(billType: string, pvCode: string) {
    this.isDisplayFuture = false;
    this.isDisplayFutureMessage = false;
    this.isHideBillAmountButton = false;

    this.isShowBillNumber = false;
    this.isShowBillAccountNumber = false;
    this.isShowBillZoneAndMonth = false;
    this.isNSUBill = false;
    this.isShowBGDCL = false;
    this.isSchoolBankingBill = false;
    this.isNIDBill = false;
    this.isBtclBill = false;
    this.isShowCustomerName = false;
    this.isShowRequestId = false;

    this.changeInputFieldStatus(false, '');
    this.f.txtBillNumber.setValidators(null);
    this.f.txtBillNumber.updateValueAndValidity();
    // var vendor = event.target.value.split('_');
    // this.billType = vendor[0];
    // this.pvCode = vendor[1];

    this.billType = billType;
    this.pvCode = pvCode;

    if (this.billType == 'DPDC') {
      this.isShowBillZoneAndMonth = true;

      this.getBillZoneList('0', this.pvCode);

      this.isShowBillNumber = false;
      this.billNumberLabelText = 'Bill Number';
      this.billZoneLabelText = 'Bill Zone';
      this.isShowBillAccountNumber = true;
      this.billAccountNumberLabelText = 'Bill Account Number';
    } else if (this.billType == 'NESCOPREPAID') {
      this.isShowBillAccountNumber = true;
      this.billAccountNumberLabelText = 'Meter No/Customer No ';
    } else if (this.billType == 'DHAKAWASA' || this.billType == 'DESCO') {
      this.isShowBillNumber = true;
      this.billNumberLabelText = 'Bill Number';

      if (this.billType == 'DHAKAWASA') {
        this.billNumberLabelText = 'Bill Number';
        this.isShowBillAccountNumber = true;
        this.billAccountNumberLabelText = 'Bill Account Number';
      }
    } else if (this.billType == 'NESCOPOSTPAID') {
      this.changeInputFieldStatus(true, this.billType);

      this.isShowBillNumber = true;
      this.billNumberLabelText = 'Bill No.';
    } else if (this.billType == 'BREBPREPAID') {
      this.changeInputFieldStatus(true, this.billType);
      // this.isShowBillNumber = true;
      // this.billNumberLabelText = 'Customer ID';
      this.isShowBillAccountNumber = true;
      this.billAccountNumberLabelText = 'Customer ID';
      this.isHideBillAmountButton = false;
      // this.isDisplayFuture = false;
      // this.isDisplayFutureMessage = false;
    } else if (this.billType == 'BREBPOSTICBS') {
      this.changeInputFieldStatus(true, this.billType);
      this.isShowBillNumber = true;
      this.billNumberLabelText = 'Customer ID';
      this.billPaymentForm.controls['txtBillNumber']?.setValidators(Validators.required);
      this.billPaymentForm.controls['txtBillNumber']?.updateValueAndValidity();

      this.isShowRequestId = true;
      // } else if (this.billType == 'RAJWASA') {
      //   this.changeInputFieldStatus(true, this.billType);

      //   this.isShowBillNumber = true;
      //   this.billNumberLabelText = 'Bill No.';

      //   this.isShowCustomerName = true;
      //   this.customerNameLabelText = 'Customer Name';
    } else if (this.billType == 'CREDITCARDBILLOWN') {
      this.isbeneficiaryRequired = true;
      this.isShowBillNumber = true;
      this.billNumberLabelText = 'Card Number';
      // this.f.txtBillNumber.setValidators([Validators.required, Validators.maxLength(17), Validators.minLength(16), Validators.pattern('[0-9]+([0-9][0-9]?)?')]);
      this.f.txtBillNumber.updateValueAndValidity();
    }
    else if (this.billType == 'CREDITCARDBILLOTHER') {
      this.isShowBillNumber = true;
      this.isbeneficiaryRequired = true;
      this.billNumberLabelText = 'Card Number';

      this.billPaymentForm.controls['ddlMFSBeneficiary']?.setValue('');
      // this.f.txtBillNumber.setValidators([Validators.required, Validators.maxLength(17), Validators.minLength(14), Validators.pattern('[0-9]+([0-9][0-9]?)?')]);
      this.f.txtBillNumber.updateValueAndValidity();
    }
  }

  getBillZone(event: any) {
    this.billZone = this.billPayment.billZone = event.target.value;
  }

  setBillProperties() {
    this.billPayment.utilityServiceBillType = this.billType;
    this.billPayment.transactionSourceId =
      this.fromBranchId == ''
        ? this.loginUser.currentUserValue.branchId
        : this.fromBranchId;
    this.billPayment.comments = this.billType + ' bill';
    this.billPayment.billamount = this.f.txtBillAmount.value;
    this.billPayment.billAccountNumber = this.f.txtBillAccountNumber.value;
    this.billPayment.billMobileNumber = '';
    this.billPayment.billZone = this.billZone;
    this.billPayment.billMonth = this.f.ddlBillMonth.value;
    this.billPayment.billYear = this.f.ddlBillYear.value;
    this.billPayment.billNumber = '';
    this.billPayment.customerid = '';
    this.billPayment.requestid = '';
    this.billPayment.currencyType = '';

    if (this.billType == 'NESCOPREPAID') {
      this.billPayment.billNumber = this.billPayment.customerid =
        this.f.txtBillAccountNumber.value;
    } else if (this.billType == 'NESCOPOSTPAID') {
      this.billPayment.customerid = this.f.txtBillNumber.value;
    } else if (this.billType == 'DHAKAWASA'|| this.billType == 'RAJWASA') {
      this.billPayment.customerid = this.f.txtBillNumber.value;
      this.billPayment.billNumber = this.f.txtBillNumber.value;
      //this.billPayment.customerName = this.f.txtCustomerName.value;
    } else if (this.billType == 'BREBPOSTICBS') {
      this.billPayment.customerid = this.f.txtBillNumber.value;
      this.billPayment.requestid = this.f.txtRequestId.value;
    } else if (this.billType == 'BREBPREPAID') {
      this.billPayment.billNumber = this.billPayment.customerid =
        this.f.txtBillAccountNumber.value;
      // this.billPayment.customerid = this.f.txtBillNumber.value;
    } else if (this.billType == 'DESCO') {
      this.billPayment.billNumber = this.f.txtBillNumber.value;
    } else if (this.billType == 'CREDITCARDBILLOWN') {
      // this.billPayment.billNumber = this.f.txtBillNumber.value;
      this.billPayment.billNumber = this.selectedCardNumber;
      this.billPayment.comments = 'own bank credit card';
      this.billPayment.currencyType = "BDT"
    }
    else if (this.billType == 'CREDITCARDBILLOTHER') {
      this.billPayment.billNumber = this.selectedCardNumber;
      // this.billPayment.billNumber = this.f.txtBillNumber.value;
      this.billPayment.comments = 'other bank credit card';
      this.billPayment.currencyType = "BDT"
      this.billPayment.paymentBankId=this.f.paymentBankId.value;
    }

    this.billPayment.paymentBranchId = this.fromBranchId;
    this.billPayment.paymentAccountNumber = this.fromAccountNumber;
    this.billPayment.TPIN = this.tpin;;
    this.billPayment.OTP = '';
    this.billPayment.slNo = '';
    this.billPayment.ppvCode = this.pvCode;
    this.billPayment.ppvName = '';

    console.log(this.billPayment);
  }

  getBillDetails() {
    this.loading = true;
    if (this.f.txtBillNumber.invalid) {
      this.loading = false;
      return;
    }
    if(this.billType == 'DHAKAWASA' && !Boolean(this.f.txtBillAccountNumber.value)){
      this.loading = false;
      return;
    }
    if (
      this.billType == 'NESCOPREPAID' || this.billType == 'DPDC' ||
      this.billType == 'NESCOPOSTPAID' || this.billType == 'DHAKAWASA' ||
      this.billType == 'RAJWASA' || this.billType == 'CREDITCARDBILLOWN' || this.billType == 'CREDITCARDBILLOTHER' ||
      this.billType == 'BREBPOSTICBS' || this.billType == 'BREBPREPAID' || this.billType == 'DESCO'
    ) {

      this.setBillProperties();
      if (this.billType == 'DHAKAWASA' && this.f.txtBillAccountNumber.value == '') { this.loading = false; return; }
      this.utilityBillService
        .getUtilityBillEnquiry(this.billPayment)
        .subscribe((response) => {
          console.log(response);
          if (response.Status == 'OK' && (response.Result.utilityServiceBillType == 'CREDITCARDBILLOWN')) {
            //this.customerNameLabelText = 'Title';
            this.billPaymentForm.controls['txtCustomerName']?.setValue(response.Result.customerName);
            this.billPaymentForm.controls['txtMfsReciverName']?.setValue(response.Result.customerName);
            //this.isShowCustomerName = true;
            this.loading = false;
            this.billPayment.ownBankCreditCardDetails = response.Result.ownBankCreditCardDetails;
            return;
          }
          if (response.Status == 'OK') {
            this.setAmount(response.Result.billamount);

            if (this.billType == 'RAJWASA') {
              this.billPaymentForm.controls['txtCustomerName']?.setValue(
                response.Result.customerName
              );
            }
            if (this.billType == 'BREBPOSTICBS') {
              this.billPaymentForm.controls['txtRequestId'].setValue(response.Result.requestid??'');

              for (let el in this.billPaymentForm.controls) {
                console.log(this.billPaymentForm.controls[el].errors)
                if (this.billPaymentForm.controls[el].errors) {
                  console.log('error'+el)
                }}


              this.popupError = false;
              this.header = 'Bill Details';
              this.message = response.Message;
              this.btnText = 'OK';
              this.popup = true;
            } else if (this.billType == 'NESCOPREPAID'|| this.billType == 'NESCOPOSTPAID') {
              this.popupError = false;
              this.header = 'Bill Details';
              this.message = response.Message;
              this.btnText = 'OK';
              this.popup = true;
            }
          } else {
            this.loading = false;
            this.submitted = false;
            // this.onReset();
            let PayOutAccount =this.f.ddlPayOutAccount.value;
            this.billPaymentForm.reset();
            this.f.ddlPayOutAccount.setValue(PayOutAccount);
            // this.billPayment.billNumber="";
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
      return;
    }

  }

  onSubmit() {
    this.submitted = true;
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined) && this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.isComponentShow = false;
      this.isOtpShow = true;
      this.forTpin = true;
      return;
    }
    this.loading = true;
    this.setBillProperties();

    console.log(this.billPayment);
    if (this.billPaymentForm.valid) {
      this.utilityBillService
        .saveUtilityBillPayment(this.billPayment)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loading = false;
          } else if (
            Response.Status == 'FAILED' ||
            Response.Status == 'OTPFAILED' ||
            Response.Status == 'UNAUTH'
          ) {
            this.loading = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.forTpin = true;
          } else if (Response.Status == 'OTP') {
            this.isComponentShow = false;
            this.isOtpShow = true;
            this.loading = false;
            this.loading = false;
            this.tpin = '';
            this.forTpin = false;
            this.title = '';
            // this.billPaymentForm.reset();
            this.billPayment = Response.Result;
          }
        });
    }
  }


  submitOtp(): void {
    if (this.forTpin) {
      this.loading = true;
      this.onSubmit();
      this.forTpin = false;
      return;
    }
    this.loading = true;

    this.billPayment.OTP = this.otp;
    console.log(this.billPayment);
    this.utilityBillService
      .saveUtilityBillPayment(this.billPayment)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          // Clear Data Field
          this.onReset();

          this.loading = false;
          this.popupError = false;
          this.header = 'Success';
          this.message =
            Response.Message + '. Transaction ID - ' + Response.Result;
          //'Bill payment is successful';
          this.btnText = 'OK';
          this.popup = true;

          this.isComponentShow = !this.isComponentShow;
          this.isOtpShow = !this.isOtpShow;
          this.changeProvider();
          this.router.navigateByUrl('/utility/billpayment');
        } else {
          this.loading = false;
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          //'Bill payment failed';
          this.btnText = 'Try again';
          this.popup = true;
        }
      });
  }


  // Set Amount to bill amount textbox from button
  setAmount(value: string) {
    this.f.txtBillAmount.setValue(value);
    this.BillAmountInWords = converter.toWords(value);
  }

  selectProvider(vendor: IUtilitybillVendorResponse) {
    this.f.mobileOperator.setValue(vendor.title);
    this.vendor = vendor;
    this.billProvider = this.vendor.id;
    this.changeUIByVendor(this.vendor.id, this.vendor.ppvCode);
    if (this.isCreditCard) {
      this.getBeneficiaryList(this.vendor.id);
      if (this.billProvider === 'CREDITCARDBILLOTHER') {
        this.getEFTBankList('1');}
        //this.pvCode='013'
    }
  }

  changeProvider() {
    this.isDisplayFuture = false;
    this.isDisplayFutureMessage = false;

    this.billProvider = '';
    this.f.mobileOperator.setValue('');
    this.onReset();
  }

  changeInputFieldStatus(isDisable: boolean, billType: string) {
    this.isHideBillAmountButton = isDisable;

    if (isDisable) {
      if (billType == 'NESCOPOSTPAID') {
        this.billPaymentForm.controls['txtBillAmount']?.disable();
      } else if (billType == 'RAJWASA') {
        this.billPaymentForm.controls['txtBillAmount']?.disable();
        this.billPaymentForm.controls['txtCustomerName']?.disable();
      } else if (billType == 'BREBPOSTICBS') {
        this.billPaymentForm.controls['txtBillAmount']?.disable();
        this.billPaymentForm.controls['txtRequestId']?.disable();
        this.billPaymentForm.controls['txtRequestId']?.setValidators(Validators.required);
        this.billPaymentForm.controls['txtRequestId']?.updateValueAndValidity();
      }
    } else {
      this.billPaymentForm.controls['txtBillAmount']?.enable();
      this.billPaymentForm.controls['txtCustomerName']?.enable();
      this.billPaymentForm.controls['txtRequestId']?.enable();
    }
  }

  getAvailableBalanceInWords(availableBalance: string) {
    this.AvailableBalanceInWords = converter.toWords(availableBalance);
  }

  onReset() {
    this.submitted = false;
    this.billPaymentForm.reset();
    this.f.ddlPayOutAccount.setValue('');
    this.f.mobileOperator.setValue('');
    // this.billProvider = '';
    this.gotAcc = false;
    this.accountBalanceResult.availablE_BALANCE = '';
    this.BillAmountInWords = '';
    this.PayeeAccountTitle = '';
    this.otp = '';
  }

  resetInputField() {
    var currentMonth =
      (new Date().getMonth() + 1).toString().length > 1
        ? new Date().getMonth() + 1
        : '0' + (new Date().getMonth() + 1);
    var currentYear = new Date().getFullYear();

    this.billPaymentForm.controls['txtBillAmount']?.setValue('');
    this.BillAmountInWords = '';
    this.billPaymentForm.controls['txtBillNumber']?.setValue('');
    this.billNumberLabelText = '';
    this.billPaymentForm.controls['txtBillAccountNumber']?.setValue('');
    this.billAccountNumberLabelText = '';
    this.billPaymentForm.controls['txtCustomerName']?.setValue('');
    this.customerNameLabelText = '';
    this.billPaymentForm.controls['ddlBillZone']?.setValue('');
    this.billZoneLabelText = '';
    this.billPaymentForm.controls['ddlStudentBillType']?.setValue('');
    this.billPaymentForm.controls['ddlFromBillMonth']?.setValue(currentMonth);
    this.billPaymentForm.controls['ddlFromBillYear']?.setValue(currentYear);
    this.billPaymentForm.controls['ddlToBillMonth']?.setValue(currentMonth);
    this.billPaymentForm.controls['ddlToBillYear']?.setValue(currentYear);
    this.billPaymentForm.controls['ddlBillMonth']?.setValue(currentMonth);
    this.billPaymentForm.controls['ddlBillYear']?.setValue(currentYear);
    this.billPaymentForm.controls['ddlBtclExchangeCode']?.setValue('');
    this.billPaymentForm.controls['txtStudentID']?.setValue('');
    this.billPaymentForm.controls['txtStudentName']?.setValue('');
    this.billPaymentForm.controls['txtNationalID']?.setValue('');
    this.billPaymentForm.controls['ddlNidBillCategory']?.setValue('');
    this.billPaymentForm.controls['txtNsuBillCode']?.setValue('');
    this.billPaymentForm.controls['txtBtclNumber']?.setValue('');
    this.billPaymentForm.controls['txtRequestId']?.setValue('');
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }


  maskCharacter(value: string, minChars = 4): string {

    const numHideChar = value.length - minChars;
    // const result = [...value].map((char, index) =>(index >= numHideChar ? char : '*'));
    const result = [...value].map((char, index) => {

      if(index < minChars){
        return char;
      }
      else if( index >= numHideChar){
        return char
      }
      else return '*';
    });

    return result.join('');
 }

 isCreditCard():boolean{
  if(this.billProvider === 'CREDITCARDBILLOWN' || this.billProvider === 'CREDITCARDBILLOTHER'){
    return true;
  }else{
    return false;
  }
  }

}
