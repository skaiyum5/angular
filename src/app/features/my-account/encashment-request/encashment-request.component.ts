import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import {
  IEncashmentAccountParam,
  IEncashmentAccountDetailsResponse,
} from 'src/app/models/encashment_accountdetails.model';
import { ICreateEncashmentRequest } from 'src/app/models/encashment_createrequest.model';
import {
  IAccountList,
  IAccountListResponse,
} from '../../../models/account_list.model';
import { BankAccountService } from '../../../services/bankaccount.service';
import { EncashmentService } from '../../../services/encashment.service';

@Component({
  selector: 'app-encashment-request',
  templateUrl: './encashment-request.component.html',
  styleUrls: ['./encashment-request.component.css'],
})
export class EncashmentRequestComponent implements OnInit {
  userAccountList: IAccountListResponse[];
  payeeAccountList: IAccountListResponse[];
  encashmentAccDtlParam: IEncashmentAccountParam = {};
  encashmentAccountDetails: IEncashmentAccountDetailsResponse = {};
  encashmentRequest: ICreateEncashmentRequest = {};

  nameValueList: string;
  encashmentType: string;
  submitted = false;

  encashmentForm: UntypedFormGroup;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private bankAccountService: BankAccountService,
    private encashmentService: EncashmentService
  ) {}

  ngOnInit(): void {
    this.getPayeeAccountList('5');

    this.encashmentForm = new UntypedFormGroup({
      ddlEncashmentType: new UntypedFormControl('', Validators.required),
      ddlEncashAccountNo: new UntypedFormControl('', Validators.required),
      txtSearchValue: new UntypedFormControl(''),
      ddlPayeeAccount: new UntypedFormControl('', Validators.required),
      txtPayeeAccSearchValue: new UntypedFormControl('')
    });
  }

  // Account List
  getAccountList(event: any) {
    this.resetInput();
    this.encashmentType = event.target.value;
    this.nameValueList = event.target.value == 'Time' ? '15' : '16';
    this.bankAccountService
      .getUserAccount(this.nameValueList)
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

  //Load Account List
  getPayeeAccountList(nameValueList: string) {
    this.bankAccountService
      .getUserAccount(nameValueList)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.payeeAccountList = Response.Result as any[];
        } else {
          // alert('Payee Account List Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Payee Account List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getSchemeEncashmentAccountDetails(param: IEncashmentAccountParam) {
    this.encashmentService
      .getSchemeAccountDetails(param)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.encashmentAccountDetails =
            Response.Result as IEncashmentAccountDetailsResponse;

          document.getElementById('lblProductID').innerHTML =
            this.encashmentAccountDetails.productID;
          document.getElementById('lblProductName').innerHTML =
            this.encashmentAccountDetails.productName;
          document.getElementById('lblTermNo').innerHTML =
            this.encashmentAccountDetails.term;
          document.getElementById('lblTermFrequency').innerHTML =
            this.getFrequency(this.encashmentAccountDetails.termFrequency);
          document.getElementById('lblPrincipalAmount').innerHTML =
            this.encashmentAccountDetails.principalAmount;
          document.getElementById('lblMaturityAmount').innerHTML =
            this.encashmentAccountDetails.maturityAmount;
          document.getElementById('lblMaturityDate').innerHTML =
            this.encashmentAccountDetails.maturityDate;
        } else {
          // alert('Scheme Account Details Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Scheme Account Details Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getTimeEncashmentAccountDetails(param: IEncashmentAccountParam) {
    this.encashmentService
      .getTimeAccountDetails(param)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.encashmentAccountDetails =
            Response.Result as IEncashmentAccountDetailsResponse;

          document.getElementById('lblProductID').innerHTML =
            this.encashmentAccountDetails.productID;
          document.getElementById('lblProductName').innerHTML =
            this.encashmentAccountDetails.productName;
          document.getElementById('lblTermNo').innerHTML =
            this.encashmentAccountDetails.term;
          document.getElementById('lblTermFrequency').innerHTML =
            this.getFrequency(this.encashmentAccountDetails.termFrequency);
          document.getElementById('lblPrincipalAmount').innerHTML =
            this.encashmentAccountDetails.principalAmount;
          document.getElementById('lblMaturityAmount').innerHTML =
            this.encashmentAccountDetails.maturityAmount;
          document.getElementById('lblMaturityDate').innerHTML =
            this.encashmentAccountDetails.maturityDate;
        } else {
          // alert('Time Account Details Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Time Account Details Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // Account Details
  getAccountDetails(event: any) {
    var acc = event.value.split('_');
    this.encashmentAccDtlParam.encashmentBranchID = acc[0];
    this.encashmentAccDtlParam.encashmentAccountNo = acc[1];

    //Reset Other Input Field
    this.resetInput();

    if (this.encashmentType == 'Time') {
      this.getTimeEncashmentAccountDetails(this.encashmentAccDtlParam);
    } else if (this.encashmentType == 'Scheme') {
      this.getSchemeEncashmentAccountDetails(this.encashmentAccDtlParam);
    }
  }

  get f() {
    return this.encashmentForm.controls;
  }

  getFrequency(termFreq: string) {
    if (termFreq == 'D') {
      return 'Day (s)';
    } else if (termFreq == 'M') {
      return 'Month (s)';
    } else if (termFreq == 'Y') {
      return 'Year (s)';
    } else {
      return 'N/A';
    }
  }

  createEncashmentRequest() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.encashmentForm.invalid) {
      return;
    }

    this.encashmentRequest.encashmentBranchID =
      this.f.ddlEncashAccountNo.value.split('_')[0];
    this.encashmentRequest.encashmentAccountNo =
      this.f.ddlEncashAccountNo.value.split('_')[1];
    this.encashmentRequest.payeeBranchID =
      this.f.ddlPayeeAccount.value.split('_')[0];
    this.encashmentRequest.payeeAccountNo =
      this.f.ddlPayeeAccount.value.split('_')[1];

    if (this.f.ddlEncashmentType.value == 'Time') {
      this.encashmentService
        .saveEncashmentForTimeAccount(this.encashmentRequest)
        .subscribe((Response) => {
          console.log(Response);
          this.submitted = false;
          if (Response.Status == 'OK') {            
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.onRefreshData();
          } else {            
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.onRefreshData();
          }
        });
    } else if (this.f.ddlEncashmentType.value == 'Scheme') {
      this.encashmentService
        .saveEncashmentForSchemeAccount(this.encashmentRequest)
        .subscribe((Response) => {          
          this.submitted = false;
          if (Response.Status == 'OK') {           
            this.popupError = false;
            this.header = 'Success';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.onRefreshData();
          } else {           
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
            this.onRefreshData();
          }
        });
    }
  }

  resetInput() {
    document.getElementById('lblProductID').innerHTML = '';
    document.getElementById('lblProductName').innerHTML = '';
    document.getElementById('lblTermNo').innerHTML = '';
    document.getElementById('lblTermFrequency').innerHTML = '';
    document.getElementById('lblPrincipalAmount').innerHTML = '';
    document.getElementById('lblMaturityAmount').innerHTML = '';
    document.getElementById('lblMaturityDate').innerHTML = '';
  }

  onRefreshData() {
    this.encashmentForm.reset();
    this.f.ddlEncashmentType.setValue('');
    this.f.ddlEncashAccountNo.setValue('');
    this.f.ddlPayeeAccount.setValue('');
    this.resetInput();
    // this.encashmentForm.patchValue({ ddlEncashAccountNo: '0' });
    // this.encashmentForm.patchValue({ ddlPayeeAccount: '0' });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
