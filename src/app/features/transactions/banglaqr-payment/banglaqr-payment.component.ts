import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as converter from 'number-to-words';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BanglaQrService } from 'src/app/services/bangla-qr.service';
import {
  ICardRegReq,
  ICardRegResp,
  IRegisteredCardList,
  IRegisteredCardDtlsResp,
} from '../../../models/bangla-qr.model';
import { IProcessPayLoadResp } from '../../../models/banglaQR_ProcessPayLoad.model';
import { ITransactionReq } from '../../../models/banglaQR_TransactionReq.model';

import { DatePipe } from '@angular/common';
import {
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';

import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-bangla-qr',
  templateUrl: './banglaqr-payment.component.html',
  styleUrls: ['./banglaqr-payment.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class BanglaQrComponent implements OnInit {
  @ViewChild('scanner') scanner: ZXingScannerComponent;

  paymentForm: UntypedFormGroup;
  addCardForm: UntypedFormGroup;

  selectedYear: number;
  selectedMonth: string;
  expiryYear: number[] = [];
  expiryMonth: any[] = [
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

  processPayLoadResp: IProcessPayLoadResp = {};
  createTransReq: ITransactionReq = {};
  registerCardReq: ICardRegReq = {};

  registeredCardList: IRegisteredCardList[];

  submitted = false;
  loader: boolean = false;

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

  //OTP
  otpComponentShow = false;
  otp = '';
  otpSubmit: Function;
  goBack: Function;

  //for TPIN
  tpin: string='';
  title: string='';
  forTpin: boolean=false;
  isTpinEnable: boolean=false;

  isShowSelectionButton: boolean = false;
  isShowQrScanner: boolean = false;
  isShowPaymentComponent: boolean = false;
  isShowAddCardComponent: boolean = false;

  cardNumberLength: number = 16;
  inputCardLength: number = 0;

  today = this.calendar.getToday();
  minDate = { year: this.today.year - 100, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  //zxing scanner
  hasDevices: boolean;
  hasPermission: boolean;
  hasScannerError: boolean = false;
  scannerErrorMessage: string;

  qrResultString: string;
  qrResult: Result;
  merchantName: string;
  merchantCardNumber: string;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;
  amountInWords: string = '';

  isCardRegOtp: boolean = false;
  isTransOtp: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private banglaQRService: BanglaQrService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    // Add Card Form
    this.addCardForm = this.formBuilder.group({
      ddlCardType: new UntypedFormControl('', Validators.required),
      txtRegCardNumber: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      ddlExpiryMonth: new UntypedFormControl(),
      ddlExpiryYear: new UntypedFormControl(),
      txtBirthdate: new UntypedFormControl(''),
      txtPhone: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      txtEmail: new UntypedFormControl('', [
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });

    // Payment Form
    this.paymentForm = this.formBuilder.group({
      ddlPaymentCardNumber: new UntypedFormControl('', Validators.required),
      txtAmount: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+(.[0-9][0-9]?)?'),
      ]),
      txtMerchantName: new UntypedFormControl(''),
      txtMerchantCardNumber: new UntypedFormControl(''),
      //txtReason: new UntypedFormControl(''),
      txtQrCode: new UntypedFormControl(''),
    });

    this.isShowSelectionButton = true;

    // this.getZxingScanner();
    this.loadExpiryMonthAndYear();
    this.getRegisteredCard();

    this.otpSubmit = this.onOtpSubmit.bind(this);
    this.goBack = this.backClick.bind(this);
    this.isTpinEnable=this.authenticationService.currentUserValue.isTPINMendatory;
  }

  getZxingScanner() {
    // zxing scanner
    this.scanner?.camerasFound?.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;

      this.hasScannerError = false;
      this.scannerErrorMessage = '';
    });

    this.scanner?.camerasNotFound?.subscribe(() => (this.hasDevices = false));
    this.scanner?.scanComplete?.subscribe(
      (result: Result) => (this.qrResult = result)
    );
    this.scanner?.permissionResponse?.subscribe(
      (perm: boolean) => (this.hasPermission = perm)
    );

    // Checking
    // if (this.hasDevices === undefined || this.hasPermission === undefined) {
    //   this.hasScannerError = true;
    //   this.scannerErrorMessage = 'Sorry! No Camera Found.';
    // }
    if (this.hasDevices === false) {
      this.hasScannerError = true;
      this.scannerErrorMessage = 'Sorry! No Camera Found.';
    }
    if (this.hasPermission === false) {
      this.hasScannerError = true;
      this.scannerErrorMessage =
        'Camera Permission Denied By User. QR Code Scanning Failed';
    }

    if (this.hasScannerError === true) {
      this.popupError = true;
      this.header = 'Failure';
      this.message = this.scannerErrorMessage;
      this.btnText = 'Close';
      this.popup = true;

      this.backToMain();
    } else {
      this.isShowQrScanner = true;
      this.isShowAddCardComponent = false;
      this.isShowPaymentComponent = false;
    }
  }

  selectProcess(processType: string) {
    this.isShowSelectionButton = false;

    if (processType == 'ScanQR') {
      this.getZxingScanner();
    } else if (processType == 'AddCard') {
      this.isShowPaymentComponent = false;
      this.isShowAddCardComponent = true;
      this.isShowQrScanner = false;
    } else if (processType == 'History') {
    }
  }
  getRegisteredCard() {
    this.banglaQRService.getRegisteredCardList().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.registeredCardList = Response.Result as IRegisteredCardList[];
      }
    });
  }

  processPayLoad(qrCodeString: string) {
    this.banglaQRService.processPayLoad(qrCodeString).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.processPayLoadResp = Response;

        if (this.processPayLoadResp.Result != null) {
          this.merchantName =
            this.processPayLoadResp.Result.payLoadData.merchantName_59;

          if (
            this.processPayLoadResp.Result.payLoadData
              .merchantAccountInformation.npsB_26 != null
          ) {
            this.merchantCardNumber =
              this.processPayLoadResp.Result.payLoadData.merchantAccountInformation.npsB_26.merchantPAN_03;
          } else if (
            this.processPayLoadResp.Result.payLoadData
              .merchantAccountInformation.npsB_27 != null
          ) {
            this.merchantCardNumber =
              this.processPayLoadResp.Result.payLoadData.merchantAccountInformation.npsB_27.merchantPAN_03;
          }

          this.payment.txtMerchantName.setValue(this.merchantName);
          this.payment.txtMerchantCardNumber.setValue(this.merchantCardNumber);

          // Hide/Show Panel based on API Status
          this.isShowQrScanner = false;
          this.isShowPaymentComponent = true;
          this.isShowAddCardComponent = false;
          this.isShowSelectionButton = false;
        }
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  cardRegistration() {
    debugger;
    if ((this.tpin == "" || this.tpin == null || this.tpin == undefined)&& this.isTpinEnable) {
      this.title = 'Please Enter Your T-PIN';
      this.otpComponentShow=true;
      this.forTpin = true;
      return;
    }
    this.loader = true;
    this.registerCardReq.fullPAN = this.addCard.txtRegCardNumber.value;
    this.registerCardReq.expireMM = this.addCard.ddlExpiryMonth.value;
    this.registerCardReq.expireYY = this.addCard.ddlExpiryYear.value;
    this.registerCardReq.dateofBirth = this.formatDate(
      this.addCard.txtBirthdate.value
    );
    this.registerCardReq.mobileNumber = this.addCard.txtPhone.value;
    this.registerCardReq.emailAddress = this.addCard.txtEmail.value;
    this.registerCardReq.otp = '';
    this.registerCardReq.TPIN=this.tpin

    this.banglaQRService
      .cardRegistration(this.registerCardReq)
      .subscribe((response) => {
        console.log(response);
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'OTP') {
          this.otpComponentShow = true;
          this.isCardRegOtp = true;
          this.isTransOtp = false;
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
        this.loader = false;
      });
  }

  createPaymentRequest() {
    this.createTransReq.selectedOwnerPANHash =
      this.payment.ddlPaymentCardNumber.value;
    this.createTransReq.selectedMarchentPAN =
      this.payment.txtMerchantCardNumber.value;
    this.createTransReq.serialNumber = '';
    this.createTransReq.keyID = this.processPayLoadResp.Result.keyID;
    this.createTransReq.key1 = this.processPayLoadResp.Result.key1;
    this.createTransReq.key2 = this.processPayLoadResp.Result.key2;
    this.createTransReq.OTP = '';
    this.createTransReq.PayLoadData =
      this.processPayLoadResp.Result.payLoadData;
    this.createTransReq.PayLoadData.transactionAmount_54 =
      this.payment.txtAmount.value;

    this.banglaQRService
      .createTransaction(this.createTransReq)
      .subscribe((response) => {
        console.log(response);
        if (response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (response.Status === 'OTP') {
          this.otpComponentShow = true;
          this.isCardRegOtp = false;
          this.isTransOtp = true;

          //
          this.createTransReq.serialNumber = response.Result.serialNumber;
          this.createTransReq.keyID = response.Result.keyID;
          this.createTransReq.key1 = response.Result.key1;
          this.createTransReq.key2 = response.Result.key2;
          //
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loader = false;
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
      this.loader = true;
      this.cardRegistration();
      this.forTpin = false;
      return;
    }
    this.loader = true;

    if (this.isCardRegOtp == true) {
      this.registerCardReq.otp = this.otp;

      this.banglaQRService
        .cardRegistration(this.registerCardReq)
        .subscribe((response) => {
          if (response.Status == 'OK') {
            this.getRegisteredCard();
            this.onResetCardReg();

            this.popupError = false;
            this.header = 'Success';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.otpComponentShow = false;
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
          this.loader = false;
        });
    } else if (this.isTransOtp == true) {
      this.createTransReq.OTP = this.otp;

      console.log(this.createTransReq);

      this.banglaQRService
        .createTransaction(this.createTransReq)
        .subscribe((response) => {
          console.log(response);
          if (response.Status == 'OK') {
            this.onResetTrans();

            this.popupError = false;
            this.header = 'Success';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.otpComponentShow = false;
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
          this.loader = false;
        });
    }
  }

  backClick() {
    this.otpComponentShow = false;
  }

  onResetCardReg() {
    this.submitted = false;
    this.addCardForm.reset();
    this.addCard.txtRegCardNumber.setValue('');

    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = '01';
    //new Date().getMonth();

    this.addCard.ddlExpiryMonth.setValue(this.selectedMonth);
    this.addCard.ddlExpiryYear.setValue(this.selectedYear);
    this.addCard.txtBirthdate.setValue('');
    this.addCard.txtPhone.setValue('');
    this.addCard.txtEmail.setValue('');
  }

  onResetTrans() {
    this.submitted = false;
    this.paymentForm.reset();
    this.payment.txtMerchantCardNumber.setValue('');
    this.payment.txtMerchantName.setValue('');
    this.payment.ddlPaymentCardNumber.setValue('');
    this.payment.txtAmount.setValue('');
    this.processPayLoadResp = null;
  }

  backToMain() {
    this.isShowAddCardComponent = false;
    this.isShowPaymentComponent = false;
    this.isShowSelectionButton = true;
    this.isShowQrScanner = false;
  }

  reScanQrCode() {
    this.payment.txtMerchantName.setValue('');
    this.payment.txtMerchantCardNumber.setValue('');

    this.isShowAddCardComponent = false;
    this.isShowPaymentComponent = false;
    this.isShowSelectionButton = false;
    this.isShowQrScanner = true;
  }

  validateCardLength(event: any): void {
    this.inputCardLength = event.target.value.length;

    if (this.inputCardLength > this.cardNumberLength) {
      event.target.value = event.target.value.slice(0, this.cardNumberLength);
      this.addCard.txtRegCardNumber.setValue(event.target.value);
      this.inputCardLength = event.target.value.length;
    }
  }

  get addCard() {
    return this.addCardForm.controls;
  }

  get payment() {
    return this.paymentForm.controls;
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  //zxing scanner
  displayCameras(cameras: MediaDeviceInfo[]) {
    console.debug('Devices: ', cameras);
    this.availableDevices = cameras;
  }

  getQrCodeResult(resultString: string) {
    if (resultString.length > 0) {
      // API Calling
      this.processPayLoad(resultString);
    }
  }

  // onDeviceSelectChange(selectedValue: string) {
  //   console.debug('Selection changed: ', selectedValue);
  //   this.currentDevice = this.scanner.getDeviceById(selectedValue);
  // }

  // stateToEmoji(state: boolean): string {
  //   const states = {
  //     // not checked
  //     undefined: '❔',
  //     // failed to check
  //     null: '⭕',
  //     // success
  //     true: '✔',
  //     // can't touch that
  //     false: '❌'
  //   };

  //   return states['' + state];
  // }

  loadExpiryMonthAndYear() {
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = '01';
    //new Date().getMonth();

    for (let year = this.selectedYear; year <= this.selectedYear + 10; year++) {
      this.expiryYear.push(year);
    }

    this.addCard.ddlExpiryMonth.setValue(this.selectedMonth);
    this.addCard.ddlExpiryYear.setValue(this.selectedYear);
  }

  getAmountInWords(event: any) {
    if (event.target.value == '') {
      this.amountInWords = '';
    } else {
      this.amountInWords = converter.toWords(event.target.value);
    }
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
