import { Component, OnInit, Inject } from '@angular/core';

import { IHomeBranchInfoResponse } from '../../models/bank_homebankbranchinfo.model';

import { IBankInfoResponse } from '../../models/bank_bankinfo.model';
import { IBankBranchInfoResponse } from '../../models/bank_otherbankbranchinfo.model';

import { IRtgsBankList } from '../../models/bank_rtgsbanklist.model';
import { IRtgsBranchListResponse } from '../../models/bank_rtgsbranchlist.model';

import { INPSBBankList } from '../../models/bank_npsbbanklist.model';

import { BankAccountService } from '../../services/bankaccount.service';
import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { IBeneficiary } from 'src/app/models/beneficiary.model';
import { AuthenticationService } from '../../services/authentication.service';
import { IFundTransferTypeResponse } from 'src/app/models/fundtransfer.model';
import { FundTransferService } from 'src/app/services/fundtransfer.service';

import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { IUtilitybillVendorResponse } from 'src/app/models/utilityvendor.model';
import { UtilitybillService } from 'src/app/services/utilitybill.service';
import { IUtilitybillpayment } from 'src/app/models/utilitybillpayment.model';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css'],
})
export class BeneficiaryComponent implements OnInit {
  beneficiaryForm: UntypedFormGroup;
  beneficiaryList: IBeneficiary[];
  beneficiary: IBeneficiary = {};
  billPayment: IUtilitybillpayment={};
  transactionTypeList: IFundTransferTypeResponse[] = [];
  tempTransactionTypeList: IFundTransferTypeResponse[] = [];

  // Other Account
  homeBankBranchList: IHomeBranchInfoResponse[];

  // EFT
  otherBankList: IBankInfoResponse[];
  otherBankBranchList: IBankBranchInfoResponse[];

  // RTGS
  rtgsBankList: IRtgsBankList[];
  rtgsBranchList: IRtgsBranchListResponse[];

  // NPSB
  npsbBankList: INPSBBankList[];

  cbsAccInfo: string = '';
  otherAccountTitle: string = '';

  displayedColumns: string[] = [
    'receiverName',
    'toBankCode',
    'toBranchCode',
    'toAccountNo',
    'receiverType',
    'beneficiaryAlias',
    'edit',
  ];
  isReceiverNameShow: boolean = true;
  // ownBankBranchId: string;
  // eftBankId: string;
  // eftBankBranchId: string;
  // rtgsBankId: string;
  // rtgsBankBranchId: string;
  // npsbBankId: string;

  beneficiaryId: number = 0;

  isComponentShow: boolean = true;
  //isCommonInputShow: boolean = false;
  isListShow: boolean = false;
  isInputShow: boolean = false;
  isOtpShow: boolean = false;
  otp: any;
  submitted = false;
  title: string;
  forTpin = false;
  forEdit = false;
  otpSubmit: Function;
  loader = false;
  isTpinEnable = false;
  creditCardBill=false;
  selectedTransactionType: string = '';
  OwnBankppvCode='';
  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  goBack: Function;
  tpin: string = '';
  forDelete: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private bankAccountService: BankAccountService,
    private fundTransferService: FundTransferService,
    private beneficiaryService: BeneficiaryService,
    private _router: Router,
    private utilityBillService: UtilitybillService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.getFundTransferTypeList()
    this.getUtilityBillVendorList()

    this.beneficiaryForm = new UntypedFormGroup({
      // ddlTransferType: new FormControl('', Validators.required),
      txtReceiverAccount: new UntypedFormControl('', [Validators.required]),//Validators.maxLength(15),Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]),
      txtReceiverName: new UntypedFormControl('', [Validators.required]),
      txtBeneficiaryName: new UntypedFormControl('', Validators.required),
      ddlOwnBankBranch: new UntypedFormControl(''),
      txtSearchValue: new UntypedFormControl(''),
      ddlEftBank: new UntypedFormControl(''),
      txtSearchEFTBank: new UntypedFormControl(''),
      ddlEftBranch: new UntypedFormControl(''),
      txtSearchEFTBranch: new UntypedFormControl(''),
      ddlRtgsBank: new UntypedFormControl(''),
      txtSearchRTGSBank: new UntypedFormControl(''),
      ddlRtgsBranch: new UntypedFormControl(''),
      txtSearchRTGSBranch: new UntypedFormControl(''),
      ddlReceiverType: new UntypedFormControl('0'),
      ddlNpsbBank: new UntypedFormControl(''),
      txtSearchNPSBBank: new UntypedFormControl('')
    });
    this.goBack = this.backClick.bind(this);
    this.otpSubmit = this.submitOtp.bind(this);
    this.isTpinEnable = this.authenticationService.currentUserValue.isTPINMendatory;
  }

  get form() {
    return this.beneficiaryForm.controls;
  }

  // Beneficiary List
  getBeneficiaryList(benficiaryType: string) {
    if(benficiaryType=="NPSB"){
      benficiaryType="NPSBA2A";
    }
    this.beneficiaryService
      .getBeneficiary(benficiaryType)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.beneficiaryList = Response.Result as IBeneficiary[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('Beneficiary List Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Beneficiary List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // Home Bank Branch
  getHomeBankBranchList(value: string) {
    this.bankAccountService
      .getHomeBankBranchList(value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.homeBankBranchList = Response.Result as any[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('RTGS Bank Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'RTGS Bank Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }
  //EFT Bank
  getEFTBankList(value: string) {
    this.bankAccountService.getBankList(value).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.otherBankList = Response.Result as any[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
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
  // EFT Bank Branch
  getEFTBranchList(event: any) {
    //this.eftBankId = event.target.value;

    this.bankAccountService
      .getOtherBankBranchList('0', event.value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.otherBankBranchList = Response.Result as any[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('Branch Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Branch Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }
// EFT Bank Branch
  getEFTBranchListForEdit(eftBankId: string) {
    //this.eftBankId = eftBankId;

    this.bankAccountService
      .getOtherBankBranchList('0', eftBankId)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.otherBankBranchList = Response.Result as any[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('Branch Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Branch Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  //Rtgs Bank
  getRTGSBankList() {
    this.bankAccountService.getRTGSBankList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.rtgsBankList = Response.Result as any[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert('RTGS Bank Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'RTGS Bank Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  // Rtgs Branch
  getRTGSBranchList(event: any) {
    //this.rtgsBankId = event.target.value;
    this.bankAccountService
      .getRTGSBranchList(event.value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.rtgsBranchList = Response.Result as any[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('RTGS Branch Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'RTGS Branch Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getRTGSBranchListForEdit(rtgsBankId: string) {
    //this.rtgsBankId = rtgsBankId;

    this.bankAccountService
      .getRTGSBranchList(rtgsBankId)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.rtgsBranchList = Response.Result as any[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          // alert('RTGS Branch Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'RTGS Branch Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  //NPSB Bank
  getNPSBBankList() {
    this.bankAccountService.getNPSBBankList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.npsbBankList = Response.Result as any[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert('NPSB Bank Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'NPSB Bank Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  // getSelectedOwnBankBranch(event: any) {
  //   this.ownBankBranchId = event.target.value;
  // }

  // getSelectedEFTBranchId(event: any) {
  //   this.eftBankBranchId = event.target.value;
  // }

  // getSelectedRTGSBranchId(event: any) {
  //   this.rtgsBankBranchId = event.target.value;
  // }

  // getSelectedNpsbBankId(event: any) {
  //   this.npsbBankId = event.target.value;
  // }

//Other Bank
  getAccORCardDetails() {

    if (this.selectedTransactionType === 'OWNBANKOTHERACC' && this.form.ddlOwnBankBranch.value && this.form.txtReceiverAccount.value) {
      this.loader=true;
      this.bankAccountService
        .getCbsAccInfo(this.form.ddlOwnBankBranch.value, this.form.txtReceiverAccount.value)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loader=false;
            this.cbsAccInfo = Response.Result;
            this.beneficiaryForm.patchValue({ txtReceiverName: this.cbsAccInfo.split(':')[0] });
            //this.otherAccountTitle = this.cbsAccInfo.split(':')[0];
          } else {
            this.loader=false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;

          }
        });
    }else if(this.selectedTransactionType === 'CREDITCARDBILLOWN'){
      this.loader=true;
      this.billPayment.utilityServiceBillType='CREDITCARDBILLOWN';
      this.billPayment.comments= "own bank credit card",
      this.billPayment.currencyType= "BDT";
      this.billPayment.ppvCode=this.OwnBankppvCode;
      this.billPayment.transactionSourceId= this.authenticationService.currentUserValue.branchId;
      this.billPayment.billNumber=this.form.txtReceiverAccount.value

      this.utilityBillService
      .getUtilityBillEnquiry(this.billPayment)
      .subscribe((response) => {
        this.loader=false;
        console.log(response);
        if (response.Status == 'OK' && (response.Result.utilityServiceBillType == 'CREDITCARDBILLOWN')) {
          this.beneficiaryForm.patchValue({ txtReceiverName: response.Result.customerName });
          //this.customerNameLabelText = 'Title';
         // this.billPaymentForm.controls['txtCustomerName']?.setValue(response.Result.customerName);
        //  .billPaymentForm.controls['txtMfsReciverName']?.setValue(response.Result.customerName);
          //this.isShowCustomerName = true;
          this.billPayment.ownBankCreditCardDetails = response.Result.ownBankCreditCardDetails;
          return;
        }
    })}
    this.loader=false;
  }

  changeTransType() {
    this.selectedTransactionType = '';
    this.resetInput();

    this.creditCardBill= false;
    this.byPhoneNumber = true;
    this.beneficiaryList = null;
    this.isInputShow = false;
    this.isListShow = false;
    this.isReceiverNameShow = true;

  }

  // FT- Provider/Vendor List
  getFundTransferTypeList() {
    this.fundTransferService.getFundTransferTypeList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.tempTransactionTypeList = Response.Result as IFundTransferTypeResponse[];
        console.log(this.tempTransactionTypeList);
        for (var index = 0; index < this.tempTransactionTypeList?.length; index++) {
          if (this.tempTransactionTypeList[index].id == 'OWNBANKOTHERACC') {
            this.tempTransactionTypeList[index].serial = 1;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/OwnBank.png`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'EFT') {
            this.tempTransactionTypeList[index].serial = 2;
            this.tempTransactionTypeList[index].title = 'EFT';
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/BB.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'RTGS') {
            this.tempTransactionTypeList[index].serial = 3;
            this.tempTransactionTypeList[index].title = 'RTGS';
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/BB.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'NPSB') {
            this.tempTransactionTypeList[index].serial = 4;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/NPSB.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'BKASH') {
            this.tempTransactionTypeList[index].serial = 5;
            this.tempTransactionTypeList[index].title = 'bKash';
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/bkash.png`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'NAGAD') {
            this.tempTransactionTypeList[index].serial = 6;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Nagad.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'TAP') {
            this.tempTransactionTypeList[index].serial = 7;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/TAP.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'ROCKET') {
            this.tempTransactionTypeList[index].serial = 8;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Rocket.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
          else if (this.tempTransactionTypeList[index].id == 'UPAY') {
            this.tempTransactionTypeList[index].serial = 9;
            this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Upay.jpg`;
            this.transactionTypeList.push(this.tempTransactionTypeList[index]);
          }
        }
        this.transactionTypeList.sort((a, b) => (a.serial < b.serial ? -1 : 1));
        console.log(this.transactionTypeList);
        this.tempTransactionTypeList = [];

      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }
  // Utility- Provider/Vendor List
  getUtilityBillVendorList() {
    this.utilityBillService.getUtilityBillVendorList().subscribe((Response: any) => {

      if (Response.Status == 'OK') {
        this.tempTransactionTypeList = [];
        var tempVendorList: IUtilitybillVendorResponse[] = [];
        tempVendorList = Response.Result as IUtilitybillVendorResponse[];
        console.log("list" + tempVendorList)
        this.tempTransactionTypeList = tempVendorList;
        for (var index = 0; index < tempVendorList.length; index++) {


          if (tempVendorList[index].id == 'CREDITCARDBILLOWN') {
            this.tempTransactionTypeList[index].serial = 31;
            this.tempTransactionTypeList[index].logo = `assets/icons/Bill/OwnBankCard.png`;
            this.transactionTypeList.push(tempVendorList[index]);
            this.OwnBankppvCode=tempVendorList[index].ppvCode;
          }
          else if (tempVendorList[index]?.id == 'CREDITCARDBILLOTHER') {
            this.tempTransactionTypeList[index].serial = 32;
            this.tempTransactionTypeList[index].logo = `assets/icons/Bill/CREDITCARD.jpg`;
            this.transactionTypeList.push(tempVendorList[index]);
          }

          //else if (tempVendorList[index].id == 'NESCOPOSTPAID') {
          // this.tempTransactionTypeList[index].serial = 32;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/NESCO.jpg`;
          // this.transactionTypeList.push(tempVendorList[index]);
          // }
          // else if (this.tempVendorList[index].id == 'NESCOPREPAID') {
          // this.tempTransactionTypeList[index].serial = 33;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/NESCO.jpg`;
          // this.transactionTypeList.push(tempVendorList[index]);
          // }
          // else if (this.tempVendorList[index].id == 'BREBPREPAID') {
          // this.tempTransactionTypeList[index].serial = 33;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/BREB.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
          // else if (this.tempVendorList[index].id == 'BREBPOSTICBS') {
          // this.tempTransactionTypeList[index].serial = 34;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/BREB.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
          // else if (this.tempVendorList[index].id == 'RAJWASA') {
          // this.tempTransactionTypeList[index].serial = 35;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/RajshahiWasa.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
          // else if (this.tempVendorList[index].id == 'DHAKAWASA') {
          // this.tempTransactionTypeList[index].serial = 36;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/WASA.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
          // else if (this.tempVendorList[index].id == 'DPDC') {
          // this.tempTransactionTypeList[index].serial = 37;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/DPDC.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
          // else if (this.tempVendorList[index].id == 'DESCO') {
          // this.tempTransactionTypeList[index].serial = 38;
          // this.tempTransactionTypeList[index].logo =`assets/icons/Bill/DESCO.jpg`;
          // this.transactionTypeList.push(tempVendorList[index])
          // }
        }
        this.transactionTypeList.sort((a, b) => (a.serial < b.serial ? -1 : 1));
        this.tempTransactionTypeList = [];
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

//--OTP---
  setOtp(otp: string) {
    if (this.forTpin) {
      this.tpin = otp;
    } else {
      this.otp = otp;
    }
  }
  backClick() {
    this.isOtpShow = false;
    this.isListShow = false;
    if (this.forDelete) {
      this.isListShow = true;
    }
    this.forDelete = false;
    this.isComponentShow = true;
    this.tpin = '';
  }
//--END OTP---

  backFromCreateOrEdit() {
    this.isListShow = true;
    this.isInputShow = false;
    this.resetInput();
    this.beneficiaryForm.reset();
  }

  createNewBeneficiary() {
    this.isListShow = false;
    this.isInputShow = true;
    this.resetInput();
    this.submitted = false;
    this.beneficiaryForm.reset();
  }
  SaveorUpdateBeneficiary() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.beneficiaryForm.invalid) {
      return;
    }
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined) && this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.isComponentShow = !this.isComponentShow;
      this.forTpin = true;
      this.isOtpShow = !this.isOtpShow;
      return;
    }
    this.loader = true;
    this.beneficiary.beneficiaryId = this.beneficiaryId;
    this.beneficiary.userId = this.authenticationService.currentUserValue.userName;
    this.beneficiary.receiverName = this.form.txtReceiverName.value;
    this.beneficiary.toAccountNo = this.form.txtReceiverAccount.value.trim();
    this.beneficiary.beneficiaryAlias = this.form.txtBeneficiaryName.value;
    this.beneficiary.transferType = this.selectedTransactionType;

    this.beneficiary.toBankCode = '';
    this.beneficiary.toBranchCode = '';
    this.beneficiary.receiverType = '';
    this.beneficiary.toRoutingNum = '';
    this.beneficiary.otp = '';
    this.beneficiary.tpin = this.tpin;

    if (this.selectedTransactionType == 'OWNBANKOTHERACC') {
      this.beneficiary.toBranchCode = this.form.ddlOwnBankBranch.value;
    } else if (this.selectedTransactionType == 'EFT') {
      this.beneficiary.toBankCode = this.form.ddlEftBank.value;
      this.beneficiary.toBranchCode = this.form.ddlEftBranch.value;
    } else if (this.selectedTransactionType == 'RTGS') {
      this.beneficiary.toBankCode = this.form.ddlRtgsBank.value;
      this.beneficiary.toBranchCode = this.form.ddlRtgsBranch.value;
    } else if (this.selectedTransactionType == 'NPSB') {
      this.beneficiary.toBankCode = this.form.ddlNpsbBank.value;
      this.beneficiary.receiverType = this.form.ddlReceiverType.value;
      this.beneficiary.transferType = "NPSBA2A";
    }
    else if (this.selectedTransactionType == 'BKASH') {
      this.beneficiary.receiverName = this.form.txtBeneficiaryName.value;
    }else if(this.selectedTransactionType == 'CREDITCARDBILLOTHER'){
      this.beneficiary.toBankCode = this.form.ddlEftBank.value;
    }

    //Post Request
    if (this.beneficiary.beneficiaryId == 0) {
      this.beneficiaryService
        .saveBeneficiary(this.beneficiary)
        .subscribe((Response) => {
          this.loader = false;
          console.log(this.beneficiary);
          console.log(Response);
          if (Response.Status == 'OK') {
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.resetInput();

            this.forDelete = false;
            this.isListShow = true;
            this.isComponentShow = true;
            this.isOtpShow = false;
            this.isInputShow = false;
            this.tpin = '';
            this.getBeneficiaryList(this.selectedTransactionType);
          } else if (Response.Status === 'UNAUTH') {
            this.authenticationService.logout();
          } else if (
            Response.Status == 'FAILED' ||
            Response.Status == 'OTPFAILED'
          ) {
            // alert(Response.Message);
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.tpin = '';
            this.forTpin = true;

          } else if (Response.Status == 'OTP') {
            this.isComponentShow = false;
            this.isOtpShow = true;
            this.title = '';
            // alert(Response.Message);
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.beneficiary = Response.Result;
          }
        });
    } else if (this.beneficiary.beneficiaryId > 0) {
      this.beneficiaryService
        .updateBeneficiary(this.beneficiary)
        .subscribe((Response) => {
          this.loader = false;
          console.log(this.beneficiary)
          console.log(Response);
          if (Response.Status == 'OK') {
            // alert(Response.Message);
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.resetInput();
            this.forDelete = false;
            this.isComponentShow = true;
            this.isOtpShow = false;

            this.isListShow = true;
            this.isInputShow = false;
            this.getBeneficiaryList(this.selectedTransactionType);
          } else if (
            Response.Status == 'FAILED' ||
            Response.Status == 'OTPFAILED'
          ) {
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.tpin = '';
            this.forTpin = true;
          } else if (Response.Status == 'OTP') {
            this.title = '';
            this.isComponentShow = false;
            this.isOtpShow = true;
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.beneficiary = Response.Result;
          }
        });
    }
  }

  onEditBeneficiary(rowData: IBeneficiary) {
    //event.stopPropagation();
    this.beneficiary = rowData;
    this.isInputShow = true;
    this.isListShow = false;
    this.forEdit = true;
    this.forDelete = false;
    this.beneficiaryId = this.beneficiary.beneficiaryId;
    this.selectedTransactionType = this.beneficiary.transferType;
    // this.beneficiaryForm.patchValue({
    //   ddlTransferType: this.beneficiary.transferType,
    // });
    this.beneficiaryForm.patchValue({
      txtReceiverAccount: this.beneficiary.toAccountNo,
    });
    this.beneficiaryForm.patchValue({
      txtReceiverName: this.beneficiary.receiverName,
    });
    this.beneficiaryForm.patchValue({
      txtBeneficiaryName: this.beneficiary.beneficiaryAlias,
    });

    if (this.beneficiary.transferType == 'OWNBANKOTHERACC') {
      this.beneficiaryForm.patchValue({
        ddlOwnBankBranch: this.beneficiary.toBranchCode,
      });
    }
    if (this.selectedTransactionType == 'EFT') {
      this.beneficiaryForm.patchValue({
        ddlEftBank: this.beneficiary.toBankCode,
      });
      this.getEFTBranchListForEdit(this.beneficiary.toBankCode);
      this.beneficiaryForm.patchValue({
        ddlEftBranch: this.beneficiary.toBranchCode,
      });
    }
    if (this.selectedTransactionType == 'RTGS') {
      this.beneficiaryForm.patchValue({
        ddlRtgsBank: this.beneficiary.toBankCode,
      });
      this.getRTGSBranchListForEdit(this.beneficiary.toBankCode);
      this.beneficiaryForm.patchValue({
        ddlRtgsBranch: this.beneficiary.toBranchCode,
      });
    }
    if (this.selectedTransactionType == 'NPSB') {
      this.beneficiaryForm.patchValue({
        ddlReceiverType: this.beneficiary.receiverType,
      });
      this.beneficiaryForm.patchValue({
        ddlNpsbBank: this.beneficiary.toBankCode,
      });
    }
  }

  onDeleteBeneficiary(rowData: IBeneficiary) {
    this.confirmationDialogService.confirm('Delete Beneficiary', 'Do you really want to delete this beneficiary ?')
      .then(confirmed => {
        if (confirmed) {
          this.forDelete = true;
          this.forTpin = true;
          this.deleteBeneficiary(rowData);
        }
      });
  }

  deleteBeneficiary(rowData: IBeneficiary) {
    this.beneficiary = rowData;
    this.forDelete = true;
    this.beneficiary.tpin = this.tpin;
    this.isListShow = false;
    this.isInputShow = false;
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined) && this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.isComponentShow = false;
      this.forTpin = true;
      this.isOtpShow = true;
      return;
    }
    this.loader = true;
    //this.beneficiaryId = this.beneficiary.beneficiaryId;

    this.beneficiaryService
      .deleteBeneficiary(this.beneficiary)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.loader = false;
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.resetInput();
          this.isListShow = true;
          this.isOtpShow = false;
          this.isInputShow = false;
          this.isComponentShow = true;
          this.getBeneficiaryList(this.selectedTransactionType);
        } else if (
          Response.Status == 'FAILED' ||
          Response.Status == 'OTPFAILED'
        ) {
          this.loader = false;
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (Response.Status == 'OTP') {
          this.loader = false;
          this.isComponentShow = false;
          this.isOtpShow = true;
          this.forTpin = false;
          this.title = '';
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.beneficiary = Response.Result;
        }
      });
  }

  submitOtp(): void {

    this.beneficiary.otp = this.otp;
    if (this.forDelete && this.forTpin) {
      this.deleteBeneficiary(this.beneficiary);
      return;
    }
    if (this.forTpin && !this.forDelete) {
      this.loader = true;
      this.SaveorUpdateBeneficiary();
      this.forTpin = false;
      return;
    }
    if (this.forDelete) {
      this.deleteBeneficiary(this.beneficiary);
      return;
    }
    if (this.forTpin) {
      this.SaveorUpdateBeneficiary();
      return;
    } else {
      this.beneficiaryService
        .saveBeneficiary(this.beneficiary)
        .subscribe((Response) => {
          console.log(Response);
          this.loader = false;

          if (Response.Status == 'OK') {
            // Clear Data Field
            this.resetInput();
            this.isListShow = true;
            this.isInputShow = false;
            this.isComponentShow = true;
            this.isOtpShow = false;

            this.popupError = false;
            this.header = 'Success';
            this.message = "Beneficiary information is added successfully";
            this.btnText = 'Close';
            this.popup = true;
            this.getBeneficiaryList(this.selectedTransactionType);
            //this._router.navigateByUrl('/transactions/beneficiary');
          } else {
            // alert(`else part : ${Response.Message}`);
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.tpin = '';
          }
        });
    }


  }
  // For phone number validation valiable
  byPhoneNumber: boolean = true;


  clickTransactionType(type: string) {
    this.resetInput();
    this.isInputShow = false;
    this.isListShow = true;
    this.selectedTransactionType = type;
    this.getBeneficiaryList(this.selectedTransactionType);

    if (this.selectedTransactionType == 'OWNBANKOTHERACC') {
      this.getHomeBankBranchList('0');
      this.byPhoneNumber = false;
    }
    if (this.selectedTransactionType == 'EFT') {
      this.getEFTBankList('1');
      this.byPhoneNumber = false;
    }
    if (this.selectedTransactionType == 'RTGS') {
      this.getRTGSBankList();
      this.byPhoneNumber = false;
    }
    if (this.selectedTransactionType == 'NPSB') {
      this.getNPSBBankList();
      this.byPhoneNumber = false;
    }
    // if(this.selectedType == "QRCASH")
    // {

    // }
    // if(this.selectedType == "QRPAY")
    // {

    // }
    // if(this.selectedType == "NAGAD")
    // {

    // }

    if (this.selectedTransactionType == 'CREDITCARDBILLOTHER') {
      this.getEFTBankList('1');
      this.byPhoneNumber = false;
      this.creditCardBill= true;
    }
    if (this.selectedTransactionType == 'CREDITCARDBILLOWN') {
      this.byPhoneNumber = false;
      this.creditCardBill= true;
    }

    if (this.selectedTransactionType == "BKASH") {
      this.isReceiverNameShow = false;
      this.form.txtReceiverName.clearValidators();
      this.form.txtReceiverName.updateValueAndValidity();
    } else {
      this.form.txtReceiverName.setValidators([Validators.required,]);
      this.form.txtReceiverName.updateValueAndValidity();
    }
    if (this.byPhoneNumber) {
      this.form.txtReceiverAccount.setValidators([Validators.required, Validators.pattern('[0-9]+([0-9][0-9]?)?')]
      );
      this.form.txtReceiverAccount.updateValueAndValidity();
    } else {
      this.form.txtReceiverAccount.setValidators([Validators.required]
      );
      this.form.txtReceiverAccount.updateValueAndValidity();
    }
  }

  resetInput() {
    this.beneficiary = {} as IBeneficiary;
    this.beneficiaryId = 0;
    this.beneficiaryForm.patchValue({ txtReceiverAccount: '' });
    this.beneficiaryForm.patchValue({ txtReceiverName: '' });
    this.beneficiaryForm.patchValue({ txtBeneficiaryName: '' });
    this.beneficiary.tpin = ''
    this.tpin = ''
    this.otp = '';
    this.beneficiaryForm.reset(this.beneficiaryForm.value)
    this.beneficiaryForm.reset();
  }
  onCloseModal(close: boolean) {
    this.popup = close;
  }

  maskCharacter(value: string, minChars = 3): string {

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
if(this.selectedTransactionType === 'CREDITCARDBILLOWN' || this.selectedTransactionType === 'CREDITCARDBILLOTHER'){
  return true;
}else{
  return false;
}
}

}
