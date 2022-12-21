import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../../../services/bankaccount.service';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { IAccountListResponse } from '../../../models/account_list.model';
import { IRequestOrderCheque } from '../../../models/request-ordercheque.model';
import { IChequeBookDefinitionResponse, Charge } from '../../../models/cheque_chequebookdefinition.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { RequestService } from '../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountType } from 'src/app/models/app_enum.model';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';

@Component({
  selector: 'app-chequebook-request',
  templateUrl: './chequebook-request.component.html',
  styleUrls: ['./chequebook-request.component.css']
})
export class ChequebookRequestComponent implements OnInit {

  chqueBookRequestForm: UntypedFormGroup;

  userAccountList: IAccountListResponse[];
  homeBankBranchList: IHomeBranchInfoResponse[];
  definitionDetails: IChequeBookDefinitionResponse[];
  chargeList: Charge[];
  requestCheque: IRequestOrderCheque = {};  

  branchId: string = '';
  accountNumber: string = '';
  definitionId: string = '';

  submitted = false;
  loading = false;
  // popup property
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  popup: boolean = false;
  
  constructor(private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private requestService: RequestService,
    private loginUser: AuthenticationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.getAccountList(AccountType.Payable.toString());
    this.getBranchList();

    this.chqueBookRequestForm = this.formBuilder.group({
      ddlAccount: new UntypedFormControl('', Validators.required),
      txtSearchValue: new UntypedFormControl(''),
      ddlDefinition: new UntypedFormControl('', Validators.required),
      ddlDeliveryBranch: new UntypedFormControl('', Validators.required),
      txtSearchDDLBranch: new UntypedFormControl(''),
    });
  }

  //Load Account List
  getAccountList(nameValueList: string) {
    this.bankAccountService
      .getUserAccount(nameValueList)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.userAccountList = Response.Result as any[];
        } else {          
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getBranchList() {
    this.bankAccountService.getHomeBankBranchList('0').subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.homeBankBranchList = Response.Result as IHomeBranchInfoResponse[];
      } else {        
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Branch Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getDefinition(event: any) {
    this.chargeList = null;
    
    //var acc = event.target.value.split('_');
    var acc = event.value.split('_');
    this.branchId = acc[0];
    this.accountNumber = acc[1];

    this.requestService
      .getChequeBookDefinition(this.branchId, this.accountNumber)
      .subscribe((Response) => {        
        if (Response.Status == 'OK') {
          this.definitionDetails = Response.Result as any[];
        } else {
          this.definitionDetails = null;
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getDefinitionDetails(event: any) {
    this.chargeList = null;
    this.definitionId = event.target.value;
    this.chargeList = this.definitionDetails.find(x => x.insT_DEF_ID == this.definitionId).charge as any[];    
  }

  get f() {
    return this.chqueBookRequestForm.controls;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.requestCheque.AccountNo = this.accountNumber;
    this.requestCheque.BranchId = this.branchId;
    this.requestCheque.DefinationId = this.definitionId;
    this.requestCheque.BookLeaf = 0;
    this.requestCheque.DeliveryBranchId = this.f.ddlDeliveryBranch.value;

    if (this.chqueBookRequestForm.valid) {
      this.requestService
        .sendOrderChequeRequest(this.requestCheque)
        .subscribe((Response) => {       
          if (Response.Status == 'OK') {
            this.loading = false;
            this.popupError = false;
            this.header = 'Success';
            this.message = 'Chequebook request is successful';
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
    this.chqueBookRequestForm.reset();
    this.f.ddlAccount.setValue('');
    this.f.ddlVendor.setValue('');
    this.f.ddlDeliveryBranch.setValue('');
    this.chargeList = null;
  }
}
