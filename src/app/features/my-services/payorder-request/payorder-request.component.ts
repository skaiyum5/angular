import { Component, OnInit } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { IRequestPayOrder } from '../../../models/request-payorder.model';
import { RequestService } from '../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as converter from 'number-to-words';

@Component({
  selector: 'app-payorder-request',
  templateUrl: './payorder-request.component.html',
  styleUrls: ['./payorder-request.component.css']
})
export class PayorderRequestComponent implements OnInit {

  payorderRequestForm: UntypedFormGroup;

  homeBankBranchList: IHomeBranchInfoResponse[];
  requestPayOrder: IRequestPayOrder = {};
  userAccountList: IAccountListResponse[];

  branchId: string;
  accountNumber: string;
  PayOrderAmountInWords: string;

  submitted = false;
  loading = false;
  
  // popup property
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  popup: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private requestService: RequestService,     
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.payorderRequestForm = this.formBuilder.group({
      ddlAccountNumber: ['', Validators.required],
      txtSearchValue: [''],
      txtBeneficiary: ['', Validators.required],
      txtAmount: ['', Validators.required],
      txtReferenceNo: ['', Validators.required],
    });
  }

  get f() {
    return this.payorderRequestForm.controls;
  }

  getAccountAndBranch(event: any) {
    var acc = event.value.split('-');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.requestPayOrder.Branchid = this.branchId;
    this.requestPayOrder.Accountnumber = this.accountNumber;    
    this.requestPayOrder.Beneficiaryname = this.f.txtBeneficiary.value;
    this.requestPayOrder.Amount = this.f.txtAmount.value;
    this.requestPayOrder.RefaranceNo = this.f.txtReferenceNo.value;

    if (this.payorderRequestForm.valid) {
      this.requestService
        .sendPayOrderRequest(this.requestPayOrder)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loading = false;
            this.popupError = false;
            this.header = 'Success';
            this.message = 'Pay Order request submitted successfully';
            this.btnText = 'OK';
            this.popup = true;

            this.onReset();
          } else {
            this.loading = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
          this.loading = false;
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.payorderRequestForm.reset();
    this.f.ddlAccountNumber.setValue('');
    this.f.txtBeneficiary.setValue('');
    this.f.txtAmount.setValue('');
    this.f.txtReferenceNo.setValue('');
  }

  getPayOrderAmountInWords(event: any) {    
    if (event.target.value == '') {
      this.PayOrderAmountInWords = '';
    } else {
      this.PayOrderAmountInWords = converter.toWords(event.target.value);     
    }
  }

}
