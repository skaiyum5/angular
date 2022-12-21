import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as converter from 'number-to-words';

import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FundTransferService } from 'src/app/services/fundtransfer.service';
import { ActivatedRoute, Router } from '@angular/router';

import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { IBeneficiary } from 'src/app/models/beneficiary.model';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { IBankInfoResponse } from 'src/app/models/bank_bankinfo.model';
import { IBankBranchInfoResponse } from 'src/app/models/bank_otherbankbranchinfo.model';
import { IRtgsBankList } from 'src/app/models/bank_rtgsbanklist.model';
import { IRtgsBranchListResponse } from 'src/app/models/bank_rtgsbranchlist.model';
import { IRtgsCountryList } from 'src/app/models/bank_rtgscountrylist.model';
import { INPSBBankList } from 'src/app/models/bank_npsbbanklist.model';
import { IAccountBalanceResponse } from 'src/app/models/account_balance.model';
import { IAccountListResponse } from 'src/app/models/account_list.model';
import { IFundTransferEFT } from 'src/app/models/fundtransfer-eft.model';
import { IFundTransferNPSB } from 'src/app/models/fundtransfer-npsb.model';
import { IFundTransferRTGS } from 'src/app/models/fundtransfer-rtgs.model';
import { IFundTransfer, IFundTransferTypeResponse } from 'src/app/models/fundtransfer.model';
import { BankAccountService } from 'src/app/services/bankaccount.service';
import { AccountType } from 'src/app/models/app_enum.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css'],
})
export class FundTransferComponent implements OnInit {
  fundTransferForm: UntypedFormGroup;
  submitted = false;
  loader: boolean = false;

  isOwnAccount = false;
  isOtherAccount = false;
  isEft = false;
  isRtgs = false;
  isNpsb = false;
  isBkash = false;
  isNagad = false;
  isTap = false;
  isRocket = false;
  isUpay = false;

  transactionTypeList: IFundTransferTypeResponse[] = [];
  tempTransactionTypeList: IFundTransferTypeResponse[] = [];

  // own acc
  fromBranchId: string = '';
  fromAccountNumber: string = '';
  payeeAccountTitle: string = '';
  toBranchId: string = '';
  toAccountNumber: string = '';
  toAccountTitle: string = '';

  // other
  beneficiaryList: IBeneficiary[];
  homeBankBranchList: IHomeBranchInfoResponse[];
  cbsAccInfo: string = '';
  otherAccountTitle: string = '';

  // eft
  otherBankList: IBankInfoResponse[];
  otherBankBranchList: IBankBranchInfoResponse[];

  // rtgs
  rtgsBankList: IRtgsBankList[];
  rtgsBranchList: IRtgsBranchListResponse[];
  rtgsCountryList: IRtgsCountryList[];

  // npsb
  npsbBankList: INPSBBankList[];
  npsbSenderType: string = '';
  npsbReceiverType: string = '';

   //dynamic test
  // userAccountList:any= [];

  //fundTransferForm: FormGroup;
  userAccountList: IAccountListResponse[];
  OwnBankToAccountList:IAccountListResponse[];
  accountBalanceResult: IAccountBalanceResponse = { availablE_BALANCE: '' };
  fundTransfer: IFundTransfer = {};
  response: any;
  isComponentShow: boolean = true;
  isOtpShow: boolean = false;
  otp: any;

  // popup property
  popup: boolean = false;
  confirmationPopup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  fromAccount = '';
  toAccount = '';
  accountName = '';
  amount = '';
  remarks = '';

  // ux
  // (own acc)
  fromAccProvided = false;
  ownToAccProvided = false;
  // (other acc)
  othAccBranchProvided = false;
  othToAccProvided = false;
  // (eft)
  eftToAccProvided = false;
  eftBankProvided = false;
  eftBranchProvided = false;
  // (rtgs)
  rtgsBankProvided = false;
  rtgsBranchProvided = false;
  // (npsb)
  npsbTranTypeProvided = false;
  npsbFromAccProvided = false;
  npsbRecTypeProvided = false;
  npsbBankProvided = false;

  // MFS (Bkash/Nagad)
  isMfsToAccProvided = false;

  ownAccountFTValue: string = '';
  otherAccountFTValue: string = '';
  eftAccountValue: IFundTransferEFT = {};
  rtgsAccountValue: IFundTransferRTGS = {};
  npsbAccountValue: IFundTransferNPSB = {};

  transferAmounts = ['500', '1000', '5000', '10000'];

  selectedTransactionType: string = '';
  AvailableBalanceInWords: string = '';
  TransferAmountInWords: string = '';

  // otpStatus: string = '';
  otpSubmit: Function;
  goBack: Function;

  accountType = AccountType;

  tpin: string;
  title: string='';
  forTpin: boolean=false;
  isTpinEnable: boolean=false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private fundTransferService: FundTransferService,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    // this.route.data.subscribe((data) => {
    //   this.userAccountList = data.accountList.Result;

    //   console.log('User Account List', this.userAccountList);

    // });

    this.getFundTransferTypeList();

    this.fundTransferForm = this.formBuilder.group({
      // common
      remarks: ['', Validators.required],
      purposeOfTransaction: ['', Validators.required],
      transferAmount: [
        '',
        [Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?'),],
      ],
      transactionType: ['', Validators.required],
      ddlPayOutAccount: [''],
      txtSearchPayOutAccount: [''],
      txtSearchValue : [''],
      // own account
      ddlToAccount: [''],
      txtSearchToAccount: [''],

      // other account
      ddlOthAccBenList: [''],
      ddlOtherBranch: [''],
      txtSearchOtherAccountBranch: [''],
      otherAccNum: [''],

      // eft
      ddlEftBenList: [''],
      ddlEftBankName: [''],
      txtSearchEFTBank:[''],
      ddlEftBranch: [''],
      txtSearchEFTBranch: [''],
      eftAccNum: [''],
      eftReciverId: [''],
      eftReciverName: [''],

      // rtgs
      ddlRtgsBenList: [''],
      ddlRtgsBankName: [''],
      txtSearchRTGSBank: [''],
      ddlRtgsBranch: [''],
      txtSearchRTGSBranch: [''],
      rtgsAccNum: [''],
      rtgsReceiverName: [''],
      rtgsReceiverAddress: [''],
      rtgsReceiverCity: [''],
      ddlRtgsCountry: [{ value: '', disabled: true }],

      // npsb
      transferFromType: [''],
      ddlNPSBBeneficiary: [''],
      ddlNpsbPayOutAcc: [''],
      txtSearchNpsbPayOutAcc: [''],
      ddlNpsbReceiverType: [''],
      ddlNpsbBankName: [''],
      txtSearchNPSBBank: [''],
      npsbReceiverName: [''],
      npsbAccNum: [''],

      // MFS (Bkash/Nagad)
      txtMfsToAccNumber: ['',],//[Validators.required,Validators.minLength(11),Validators.maxLength(11),Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]
      txtMfsReciverName: [''],
      ddlMFSBeneficiary: ['']
    });
    this.otpSubmit = this.submitOtp.bind(this);
    this.goBack = this.backClick.bind(this);

    this.route.queryParams.subscribe(params => {
      if (params.transferType != null) {
        this.clickTransactionType(params.transferType);
      }
    }
    );
    this.isTpinEnable=this.authenticationService.currentUserValue.isTPINMendatory;
  }

  get f() {
    return this.fundTransferForm.controls;
  }

  clickTransactionType(type: string) {
    this.refreshOnTransactionType();

    this.selectedTransactionType = type;
    this.f.transactionType.setValue(type);

    this.isOwnAccount = false;
    this.isOtherAccount = false;
    this.isEft = false;
    this.isRtgs = false;
    this.isNpsb = false;
    this.isBkash = false;
    this.isNagad = false;
    this.isTap = false;
    this.isRocket = false;
    this.isUpay = false;
    this.getBeneficiaryList(type);

    if (type === 'OWNBANK') {
      this.isOwnAccount = true;
      this.bankAccountService
      .getUserAccount(this.accountType.OwnBankToAccount.toString())
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.OwnBankToAccountList = Response.Result as IAccountListResponse[];
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
    } else if (type === 'OWNBANKOTHERACC') {
      this.isOtherAccount = true;
      this.getHomeBankBranchList();
    } else if (type === 'EFT') {
      this.isEft = true;
      this.getOtherBankList();
    } else if (type === 'RTGS') {
      this.isRtgs = true;
      this.getRTGSBankList();
      this.getRTGSCountryList();
    } else if (type === 'NPSB') {
      this.isNpsb = true;
      this.getNPSBBankList();
      this.getBeneficiaryList("NPSBA2A");
    } else if (type === 'NAGAD') {
      this.isNagad = true;
    } else if (type === 'BKASH') {
      this.isBkash = true;
    } else if (type === 'TAP') {
      this.isTap = true;
    } else if (type === 'ROCKET') {
      this.isRocket = true;
    } else if (type === 'UPAY') {
      this.isUpay = true;
    } else if (type === 'BULKFT') {
      this.router.navigate(['transactions/bulk-transfer']);
    }

    if (type != 'NPSB') {
      this.getAccountList(this.accountType.FundTransfer.toString());
    }

    if(this.isBkash || this.isNagad || this.isTap || this.isRocket || this.isUpay){
      this.f.txtMfsToAccNumber.setValidators([Validators.required,Validators.pattern('[0-9]+([0-9][0-9]?)?')]
      );
      this.f.txtMfsToAccNumber.updateValueAndValidity();

      this.f.transferAmount.setValidators([Validators.required,Validators.pattern('[0-9]+([0-9][0-9]?)?')]
      );
      this.f.transferAmount.updateValueAndValidity();

    }
  }

  changeTransType() {
    this.selectedTransactionType = '';
    this.resetForm();
    this.f.transactionType.setValue('');
  }

  clickToAccount(event: any) {
    let acc = event.value.split('_');
    this.toBranchId = acc[0];
    this.toAccountNumber = acc[1];
    this.toAccountTitle = acc[2];
  }

  //Account List
  getAccountList(nameValueList: string) {
    this.userAccountList = null;

    this.bankAccountService
      .getUserAccount(nameValueList)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.userAccountList = Response.Result as IAccountListResponse[];
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // common
  getAccountDetails(event: any) {
    if (event.value === '') return;
    var acc = event.value.split('_');
    this.fromBranchId = acc[0];
    this.fromAccountNumber = acc[1];
    this.payeeAccountTitle = acc[2];

    this.bankAccountService
      .getAccountBalance(this.fromBranchId, this.fromAccountNumber)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.accountBalanceResult = Response.Result;
          this.getAvailableBalanceInWords(
            this.accountBalanceResult.availablE_BALANCE
          );
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account Balance Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getBeneficiaryList(beneficiaryType: string) {
    if(beneficiaryType == 'OWNBANK' || beneficiaryType == 'NPSB')
    {
      return;
    }
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

  // other account
  populateOthAccByBenificiary(event: any) {
    if(event.value == null || event.value == '')
    {
      this.f.ddlOtherBranch.setValue('');
      this.f.otherAccNum.setValue('');
      this.otherAccountTitle = '';
      return;
    }

    let beneficiaryId = parseInt(event.value.split('-')[0]);
    let benificary = this.beneficiaryList.filter(
      (b) => b.beneficiaryId === beneficiaryId
    )[0];
    let branch = this.homeBankBranchList.filter(
      (b) => b.brancH_ID === benificary.toBranchCode
    )[0];
    if (branch) {
      this.f.ddlOtherBranch.setValue(branch.brancH_ID);
      this.provideOthAccBranch();
      this.f.otherAccNum.setValue(benificary.toAccountNo);
      this.bankAccountService
        .getCbsAccInfo(branch.brancH_ID, benificary.toAccountNo)
        .subscribe((response) => {
          if (response.Status == 'OK') {
            this.cbsAccInfo = response.Result;
            this.otherAccountTitle = this.cbsAccInfo.split(':')[0];
            this.provideOthToAcc();
          } else {
            // alert('CBS Account Details Loading Failed');
            this.popupError = true;
            this.header = 'Failure';
            this.message = 'CBS Account Details Loading Failed';
            this.btnText = 'Close';
            this.popup = true;
          }
        });
    }
  }

  getHomeBankBranchList() {
    this.bankAccountService.getHomeBankBranchList('0').subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.homeBankBranchList = Response.Result as IHomeBranchInfoResponse[];
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

  // eft
  getToAccountDetails() {
    let branchId = this.f.ddlOtherBranch.value;
    let accountNo = this.f.otherAccNum.value;

    if(branchId === null || accountNo === null)
    {
      return;
    }

    this.bankAccountService
      .getCbsAccInfo(branchId, accountNo)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.cbsAccInfo = Response.Result;
          this.otherAccountTitle = this.cbsAccInfo.split(':')[0];
          this.provideOthToAcc();
        } else {
          this.cbsAccInfo = null;
          this.otherAccountTitle = '';
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'CBS Account Details Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  populateEftByBenificiary(event: any) {
    if(event.target.value == null || event.target.value == '')
    {
      this.f.ddlEftBankName.setValue('');
      this.f.ddlEftBranch.setValue('');
      this.f.eftAccNum.setValue('');
      this.f.eftReciverName.setValue('');
      return;
    }

    let beneficiaryId = parseInt(event.target.value.split('-')[0]);
    let benificary = this.beneficiaryList.filter(
      (b) => b.beneficiaryId === beneficiaryId
    )[0];
    let bank = this.otherBankList.filter(
      (b) => b.banK_ID === benificary.toBankCode
    )[0];
    if (bank) {
      this.f.ddlEftBankName.setValue(bank.banK_ID);
      this.bankAccountService
        .getOtherBankBranchList('0', bank.banK_ID)
        .subscribe((response) => {
          if (response.Status == 'OK') {
            this.otherBankBranchList =
              response.Result as IBankBranchInfoResponse[];
            this.provideEftBank();
            if (this.otherBankBranchList) {
              let branch = this.otherBankBranchList.filter(
                (b) => b.BANK_BR_ID === benificary.toBranchCode
              )[0];
              this.f.ddlEftBranch.setValue(branch.BANK_BR_ID);
              this.provideEftBranch();
              this.f.eftAccNum.setValue(benificary.toAccountNo);
              this.f.eftReciverName.setValue(benificary.receiverName);
            }
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = 'Branch Loading Failed';
            this.btnText = 'Close';
            this.popup = true;
          }
        });
    }
  }

  getOtherBankList() {
    this.bankAccountService.getBankList('1').subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.otherBankList = Response.Result as IBankInfoResponse[];
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

  getOtherBankBranchList(event: any) {
    this.bankAccountService
      .getOtherBankBranchList('0', event.value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.otherBankBranchList =
            Response.Result as IBankBranchInfoResponse[];
          this.provideEftBank();
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

  // rtgs
  populateRtgsByBenificiary(event: any) {
    if(event.target.value == null || event.target.value == '')
    {
      this.f.ddlRtgsBankName.setValue('');
      this.f.ddlRtgsBranch.setValue('');
      this.f.rtgsAccNum.setValue('');
      this.f.rtgsReceiverName.setValue('');
      return;
    }

    let beneficiaryId = parseInt(event.target.value.split('-')[0]);
    let benificary = this.beneficiaryList.filter(
      (b) => b.beneficiaryId === beneficiaryId
    )[0];
    let bank = this.rtgsBankList.filter(
      (b) => b.rtgS_BANK_ID === benificary.toBankCode
    )[0];
    if (bank) {
      this.f.ddlRtgsBankName.setValue(bank.rtgS_BANK_ID);
      this.bankAccountService
        .getRTGSBranchList(bank.rtgS_BANK_ID)
        .subscribe((response) => {
          if (response.Status == 'OK') {
            this.rtgsBranchList = response.Result as IRtgsBranchListResponse[];
            this.provideRtgsBank();
            if (this.rtgsBranchList) {
              let branch = this.rtgsBranchList.filter(
                (b) => b.rtgS_BRANCH_ID === benificary.toBranchCode
              )[0];
              this.f.ddlRtgsBranch.setValue(branch.rtgS_BRANCH_ID);
              this.provideRtgsBranch();
              this.f.rtgsAccNum.setValue(benificary.toAccountNo);
              this.f.rtgsReceiverName.setValue(benificary.receiverName);
            }
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = 'Branch Loading Failed';
            this.btnText = 'Close';
            this.popup = true;
          }
        });
    }
  }

  getRTGSBankList() {
    this.bankAccountService.getRTGSBankList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.rtgsBankList = Response.Result as IRtgsBankList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'RTGS Bank Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getRTGSBranchList(event: any) {
    this.bankAccountService
      .getRTGSBranchList(event.value)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.rtgsBranchList = Response.Result as IRtgsBranchListResponse[];
          this.provideRtgsBank();
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

  getRTGSCountryList() {
    this.bankAccountService.getRTGSCountryList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.rtgsCountryList = Response.Result as IRtgsCountryList[];
        this.f.ddlRtgsCountry.setValue(
          this.rtgsCountryList.find(
            (country) => country.country === 'BANGLADESH'
          ).countrY_CODE
        );
      } else {
        // alert('RTGS Country Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'RTGS Country Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  // npsb
  populateNpsbByBenificiary(event: any) {
    if(event.target.value == null || event.target.value == '')
    {
      this.f.ddlNpsbBankName.setValue('');
      this.f.npsbAccNum.setValue('');
      this.f.npsbReceiverName.setValue('');
      return;
    }
    let beneficiaryId = parseInt(event.target.value.split('-')[0]);
    let benificary = this.beneficiaryList.filter(
      (b) => b.beneficiaryId === beneficiaryId
    )[0];
    let bank = this.npsbBankList.filter(
      (b) => b.acquirinG_BANK_CODE === benificary.toBankCode
    )[0];
    //console.log(bank);
    if (bank) {
      this.f.ddlNpsbReceiverType.setValue(
        benificary.receiverType === 'Account' ? 'A' : 'C'
      );
      this.provideNpsbRecType();
      this.f.ddlNpsbBankName.setValue(bank.acquirinG_BANK_CODE);
      this.provideNpsbBank();
      this.f.npsbAccNum.setValue(benificary.toAccountNo);
      this.f.npsbReceiverName.setValue(benificary.receiverName);
    }
  }

  getNPSBBankList() {
    this.bankAccountService.getNPSBBankList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.npsbBankList = Response.Result as INPSBBankList[];
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

  showNPSBAccountOrCard(event: any) {
    this.npsbSenderType = event.target.value;
    if (event.target.value == 'A') {
      this.getAccountList(this.accountType.FundTransfer.toString());
    } else {
      this.userAccountList = null;
    }
  }

  getAvailableBalanceInWords(availableBalance: string) {
    this.AvailableBalanceInWords = converter.toWords(availableBalance);
  }

  getTransferAmountInWords(event: any) {
    if (event.target.value == '') {
      this.TransferAmountInWords = '';
    } else {
      this.TransferAmountInWords = converter.toWords(event.target.value);
    }
  }

  setAmount(value: string) {
    this.f.transferAmount.setValue(value);
    this.TransferAmountInWords = converter.toWords(value);
  }

  getMFSToAccount(event: any)
  {
    if(event.target.value != '')
      this.isMfsToAccProvided = true;
    else
      this.isMfsToAccProvided = false;
  }

   // MFS Beneficiary
   populateMFSByBenificiary(event: any) {
    if(event.target.value == null || event.target.value == '')
    {
      this.fundTransferForm.controls['txtMfsToAccNumber'].setValue('');
      this.fundTransferForm.controls['txtMfsReciverName'].setValue('');
      return;
    }
    let beneficiaryId = parseInt(event.target.value.split('-')[0]);
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
      this.fundTransferForm.controls['txtMfsToAccNumber'].setValue(benificary.toAccountNo);
      this.fundTransferForm.controls['txtMfsReciverName'].setValue(benificary.receiverName);
      this.isMfsToAccProvided = true;
    //}
  }

  confirmSubmit() {
    this.popupError = false;
    this.header = 'Confirm';
    this.message = 'Are you sure you want to continue?';
    this.fromAccount = this.fromAccountNumber;

    if (this.isOwnAccount) {
      this.toAccount = this.toAccountNumber;
      this.accountName = this.toAccountTitle;
    }
    if (this.isOtherAccount) {
      this.toAccount = this.f.otherAccNum.value;
      this.accountName = this.otherAccountTitle;
    }
    if (this.isEft) {
      this.toAccount = this.f.eftAccNum.value;
      this.accountName = this.f.eftReciverName.value;
    }
    if (this.isRtgs) {
      this.toAccount = this.f.rtgsAccNum.value;
      this.accountName = this.f.rtgsReceiverName.value;
    }
    if (this.isNpsb) {
      this.toAccount = this.f.npsbAccNum.value;
      this.accountName = this.f.npsbReceiverName.value;
    }
    if(this.isBkash || this.isNagad || this.isTap || this.isRocket || this.isUpay)
    {
      this.toAccount = this.f.txtMfsToAccNumber.value;
      this.accountName = this.f.txtMfsReciverName.value;
    }

    this.amount = this.f.transferAmount.value;
    this.remarks = this.f.remarks.value;
    this.btnText = 'Submit';
    this.confirmationPopup = true;
  }

  onSubmit() {
    this.confirmationPopup = false;
    this.fundTransfer.OTP = '';
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined)&& this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.isComponentShow = false;
      this.forTpin = true;
      this.isOtpShow = true;
      return;
    }
    this.loader = true;
    this.fundTransfer.TPIN=this.tpin;
    this.fundTransfer.TRANSACTION_ORIGINATED_BY = 'IBU';
    this.fundTransfer.AMOUNT_LCY = this.f.transferAmount.value;
    this.fundTransfer.AMOUNT_CCY = this.f.transferAmount.value;
    this.fundTransfer.ADDENDA_INFORMATION = this.f.remarks.value;
    this.fundTransfer.PURPOSE_OF_TRANSACTION =
      this.f.purposeOfTransaction.value;
    this.fundTransfer.TRANSFER_TYPE = this.f.transactionType.value;

    if (this.isOwnAccount) {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;
      this.fundTransfer.TO_BRANCH_ID = this.toBranchId;
      this.fundTransfer.TO_ACCOUNT_NO = this.toAccountNumber;
      this.fundTransfer.RECEIVER_NM = this.toAccountTitle.split(",")[0];
    }
    if (this.isOtherAccount) {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;
      this.fundTransfer.TO_BRANCH_ID = this.f.ddlOtherBranch.value;
      this.fundTransfer.TO_ACCOUNT_NO = this.f.otherAccNum.value;
      this.fundTransfer.RECEIVER_NM = this.otherAccountTitle.split(",")[0];
    }
    if (this.isEft) {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;

      this.fundTransfer.BANK_ID = this.f.ddlEftBankName.value;
      this.fundTransfer.RECEIVER_ID = this.f.eftReciverId.value;
      this.fundTransfer.RECEIVER_NM = this.f.eftReciverName.value;
      this.fundTransfer.OTHER_BANK_BRANCH_ID = this.f.ddlEftBranch.value;

      this.fundTransfer.TO_BRANCH_ID = this.f.ddlEftBranch.value;
      this.fundTransfer.TO_ACCOUNT_NO = this.f.eftAccNum.value;
    }
    if (this.isRtgs) {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;

      this.fundTransfer.BANK_ID = this.f.ddlRtgsBankName.value;
      this.fundTransfer.RECEIVER_NM = this.f.rtgsReceiverName.value;
      this.fundTransfer.OTHER_BANK_BRANCH_ID = this.f.ddlRtgsBranch.value;
      this.fundTransfer.RTGS_ADDRESS = this.f.rtgsReceiverAddress.value;
      this.fundTransfer.RTGS_CITY = this.f.rtgsReceiverCity.value;
      this.fundTransfer.RTGS_COUNTRY = this.f.ddlRtgsCountry.value;

      this.fundTransfer.TO_BRANCH_ID = this.f.ddlRtgsBranch.value;
      this.fundTransfer.TO_ACCOUNT_NO = this.f.rtgsAccNum.value;
    }
    if (this.isNpsb) {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;

      this.fundTransfer.TRANSFER_TYPE =
        'NPSB' +
        this.f.transferFromType.value +
        '2' +
        this.f.ddlNpsbReceiverType.value;

      this.fundTransfer.BANK_ID = this.f.ddlNpsbBankName.value;
      this.fundTransfer.RECEIVER_NM = this.f.npsbReceiverName.value;
      this.fundTransfer.TO_ACCOUNT_NO = this.f.npsbAccNum.value;
    }

    if (this.isBkash || this.isNagad || this.isTap || this.isRocket || this.isUpay)
    {
      this.fundTransfer.FROM_BRANCH_ID = this.fromBranchId;
      this.fundTransfer.FROM_ACCOUNT_NO = this.fromAccountNumber;
      this.fundTransfer.TO_BRANCH_ID = '';
      this.fundTransfer.TO_ACCOUNT_NO = this.f.txtMfsToAccNumber.value;
      this.fundTransfer.RECEIVER_NM = this.f.txtMfsReciverName.value;
    }

    if (this.fundTransferForm.valid) {
      this.fundTransferService
        .saveFundTransfer(this.fundTransfer)
        .subscribe((Response) => {
          console.log(this.fundTransfer);
          console.log(Response);
          if (Response.Status == 'OK') {
            this.loader = false;
          } else if (
            Response.Status == 'FAILED' ||
            Response.Status == 'OTPFAILED' ||
            Response.Status == 'UNAUTH'
          ) {
            this.loader = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.forTpin = true;
          } else if (Response.Status == 'OTP') {
            this.isComponentShow = false;
            this.isOtpShow = true;
            this.loader = false;
            this.tpin='';
            this.forTpin=false;
            this.title='';
            // this.fundTransferForm.reset();
            // alert(Response.Message);
            // this.fundTransfer = Response.Result;
            this.response = Response.Result;
          }
        });
    }
  }

  setOtp(otp: string) {
    if (this.forTpin) {
      this.tpin = otp;
    } else {
      this.otp = otp;
    }
  }

  submitOtp(): void {
    if (this.forTpin) {
      this.loader = true;
      this.onSubmit();
      this.forTpin = false;
      return;
    }
    this.loader = true;

    this.fundTransfer.OTP = this.otp;

    this.fundTransferService
      .saveFundTransfer(this.fundTransfer)
      .subscribe((Response) => {
        console.log(this.response);
        if (Response.Status == 'OK') {
          this.loader = false;
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message + '. Transaction ID - ' + Response.Result;
          this.fromAccount = this.fromAccountNumber;
          this.toAccount = this.response.tO_ACCOUNT_NO;
          this.accountName = this.response.receiveR_NM;
          this.amount = this.response.amounT_CCY;
          this.remarks = this.f.remarks.value;
          this.btnText = 'OK';
          this.popup = true;
          this.title='';
          // Clear Data Field
          this.resetForm();

          this.isComponentShow = !this.isComponentShow;
          this.isOtpShow = !this.isOtpShow;
          // this._router.navigateByUrl('/transactions/fundtransfer');
        } else {
          this.loader = false;
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Try again';
          this.popup = true;
        }
      });
  }

  backClick() {
    this.isComponentShow = true;
    this.isOtpShow = false;
    this.popup = false;
    this.confirmationPopup=false;
    this.tpin ='';
    this.otp='';
  }

  onCloseModal(close: boolean) {
    if(this.header === 'Confirm') {
      this.onSubmit();
    }
    this.popup = close;
    this.confirmationPopup = close;
    // this.isComponentShow = true;
    // this.isOtpShow = false;
  }

  refreshOnTransactionType() {
    // this.fundTransfer = new IFundTransfer();
    this.fundTransferForm.reset();
    this.fromBranchId = '';
    this.fromAccountNumber = '';
    this.payeeAccountTitle = '';
    this.npsbSenderType = '';
    this.otp = '';

    this.beneficiaryList = [];

    this.fundTransferForm.controls['ddlPayOutAccount'].setValue('');
    this.fundTransferForm.controls['transferFromType'].setValue('');
    this.fundTransferForm.controls['ddlToAccount'].setValue('');
    this.fundTransferForm.controls['ddlNpsbPayOutAcc'].setValue('');

    this.accountBalanceResult.availablE_BALANCE = '';
    this.AvailableBalanceInWords = '';

    this.toBranchId = '';
    this.toAccountNumber = '';
    this.toAccountTitle = '';
    this.otherAccountTitle = '';

    this.fundTransferForm.controls['transferAmount'].setValue('');
    this.TransferAmountInWords = '';
    this.fundTransferForm.controls['remarks'].setValue('');
    this.fundTransferForm.controls['purposeOfTransaction'].setValue('');

    this.fundTransferForm.controls['ddlOthAccBenList'].setValue('');
    this.fundTransferForm.controls['ddlEftBenList'].setValue('');
    this.fundTransferForm.controls['ddlRtgsBenList'].setValue('');
    this.fundTransferForm.controls['ddlNPSBBeneficiary'].setValue('');

    this.fundTransferForm.controls['txtMfsToAccNumber'].setValue('');
    this.fundTransferForm.controls['txtMfsReciverName'].setValue('');
    this.fundTransferForm.controls['ddlMFSBeneficiary'].setValue('');

    // ux
    this.fromAccProvided = false;
    this.ownToAccProvided = false;
    this.othAccBranchProvided = false;
    this.othToAccProvided = false;
    this.eftToAccProvided = false;
    this.eftBankProvided = false;
    this.eftBranchProvided = false;
    this.npsbTranTypeProvided = false;
    this.npsbFromAccProvided = false;
    this.npsbRecTypeProvided = false;
    this.npsbBankProvided = false;
    this.rtgsBankProvided = false;
    this.rtgsBranchProvided = false;
    this.isMfsToAccProvided = false;
  }

  resetForm() {
    this.fundTransferForm.reset();
    this.fundTransferForm.controls['ddlPayOutAccount'].setValue('');
    this.fundTransferForm.controls['transferFromType'].setValue('');
    this.fundTransferForm.controls['purposeOfTransaction'].setValue('');
    if (this.isOwnAccount) {
      this.fundTransferForm.controls['transactionType'].setValue('OWNBANK');
    } else if (this.isOtherAccount) {
      this.fundTransferForm.controls['transactionType'].setValue(
        'OWNBANKOTHERACC'
      );
    } else if (this.isEft) {
      this.fundTransferForm.controls['transactionType'].setValue('EFT');
    } else if (this.isNpsb) {
      this.fundTransferForm.controls['transactionType'].setValue('NPSB');
    } else if (this.isRtgs) {
      this.fundTransferForm.controls['transactionType'].setValue('RTGS');
    } else if (this.isBkash) {
      this.fundTransferForm.controls['transactionType'].setValue('BKASH');
    } else if (this.isNagad) {
      this.fundTransferForm.controls['transactionType'].setValue('NAGAD');
    } else if (this.isTap) {
      this.fundTransferForm.controls['transactionType'].setValue('TAP');
    } else if (this.isRocket){
      this.fundTransferForm.controls['transactionType'].setValue('ROCKET');
    } else if (this.isUpay) {
      this.fundTransferForm.controls['transactionType'].setValue('UPAY');
    }
    this.fundTransferForm.controls['ddlToAccount'].setValue('');
    this.fundTransferForm.controls['ddlNpsbPayOutAcc'].setValue('');
    this.fromBranchId = '';
    this.fromAccountNumber = '';
    this.payeeAccountTitle = '';
    this.npsbSenderType = '';
    // this.selectedTransactionType = 'OWNBANK';

    this.accountBalanceResult.availablE_BALANCE = '';
    this.AvailableBalanceInWords = '';

    this.toBranchId = '';
    this.toAccountNumber = '';
    this.toAccountTitle = '';
    this.otherAccountTitle = '';

    this.TransferAmountInWords = '';

    this.fundTransferForm.controls['ddlOthAccBenList'].setValue('');
    this.fundTransferForm.controls['ddlEftBenList'].setValue('');
    this.fundTransferForm.controls['ddlRtgsBenList'].setValue('');
    this.fundTransferForm.controls['ddlNPSBBeneficiary'].setValue('');

    this.fundTransferForm.controls['txtMfsToAccNumber'].setValue('');
    this.fundTransferForm.controls['txtMfsReciverName'].setValue('');
    this.fundTransferForm.controls['ddlMFSBeneficiary'].setValue('');

    // this.isOwnAccount = true;
    // this.isOtherAccount = false;
    // this.isEft = false;
    // this.isRtgs = false;
    // this.isNpsb = false;
    // this.isBkash = false;
    // this.isNagad = false;

    // ux
    this.fromAccProvided = false;
    this.ownToAccProvided = false;
    this.othAccBranchProvided = false;
    this.othToAccProvided = false;
    this.eftToAccProvided = false;
    this.eftBankProvided = false;
    this.eftBranchProvided = false;
    this.npsbTranTypeProvided = false;
    this.npsbFromAccProvided = false;
    this.npsbRecTypeProvided = false;
    this.npsbBankProvided = false;
    this.rtgsBankProvided = false;
    this.rtgsBranchProvided = false;
    this.isMfsToAccProvided = false;
  }

  // ux
  provideFromAcc() {
    this.fromAccProvided = true;
  }

  provideOwnToAcc() {
    this.ownToAccProvided = true;
  }

  provideOthAccBranch() {
    this.othAccBranchProvided = true;
  }

  provideOthToAcc() {
    this.othToAccProvided = true;
  }

  provideEftToAcc() {
    this.eftToAccProvided = true;
  }

  provideEftBank() {
    this.eftBankProvided = true;
  }

  provideEftBranch() {
    this.eftBranchProvided = true;
  }

  provideRtgsBank() {
    this.rtgsBankProvided = true;
  }

  provideRtgsBranch() {
    this.rtgsBranchProvided = true;
  }

  provideNpsbTranType() {
    this.npsbTranTypeProvided = true;
  }

  provideNpsbFromAcc() {
    this.npsbFromAccProvided = true;
  }

  provideNpsbRecType() {
    this.npsbRecTypeProvided = true;
  }

  provideNpsbBank() {
    this.npsbBankProvided = true;
  }

  getFundTransferTypeList() {
    this.transactionTypeList = [];
    this.fundTransferService.getFundTransferTypeList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.tempTransactionTypeList = Response.Result as IFundTransferTypeResponse[];

        for(var index = 0; index < this.tempTransactionTypeList.length; index++)
        {
            if(this.tempTransactionTypeList[index].id == 'OWNBANK')
            {
              this.tempTransactionTypeList[index].serial = 1;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/OwnBank.png`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'OWNBANKOTHERACC')
            {
              this.tempTransactionTypeList[index].serial = 2;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/OwnBank.png`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'EFT')
            {
              this.tempTransactionTypeList[index].serial = 3;
              this.tempTransactionTypeList[index].title = 'EFT';
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/BB.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'RTGS')
            {
              this.tempTransactionTypeList[index].serial = 4;
              this.tempTransactionTypeList[index].title = 'RTGS';
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/BB.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'NPSB')
            {
              this.tempTransactionTypeList[index].serial = 5;
              this.tempTransactionTypeList[index].title = 'NPSB';
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/NPSB.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'BKASH')
            {
              this.tempTransactionTypeList[index].serial = 6;
              this.tempTransactionTypeList[index].title = 'bKash';
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/bkash.png`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'NAGAD')
            {
              this.tempTransactionTypeList[index].serial = 7;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Nagad.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'TAP')
            {
              this.tempTransactionTypeList[index].serial = 8;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/TAP.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'ROCKET')
            {
              this.tempTransactionTypeList[index].serial = 9;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Rocket.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
            else if(this.tempTransactionTypeList[index].id == 'UPAY')
            {
              this.tempTransactionTypeList[index].serial = 10;
              this.tempTransactionTypeList[index].logo = `assets/icons/FundTransfer/Upay.jpg`;
              this.transactionTypeList.push(this.tempTransactionTypeList[index]);
            }
        }
        this.transactionTypeList.sort((a, b) => (a.serial < b.serial ? -1 : 1));
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
}

