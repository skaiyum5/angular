import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAccountListResponse } from 'src/app/models/account_list.model';
import * as converter from 'number-to-words';
import { BankAccountService } from 'src/app/services/bankaccount.service';
import {
  ISchemeTimeProduct,
  ISchemeTimeProductList,
} from 'src/app/models/scheme_time_product.model';
import { AccountOpeningService } from 'src/app/services/account-opening.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ISchemeTerm } from 'src/app/models/scheme_terms.model';
import { ISchemeInstallment } from 'src/app/models/scheme_installment.model';
import { ISchemeDetails } from 'src/app/models/scheme_details.model';
import { ITimeInfo } from 'src/app/models/time_info.model';
import { ITimeAccDetails } from 'src/app/models/time_acc_details.model';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
// import {Observable} from 'rxjs';
// import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-account-opening',
  templateUrl: './account-opening.component.html',
  styleUrls: ['./account-opening.component.css'],
})
export class AccountOpeningComponent implements OnInit {
  accOpeningForm: UntypedFormGroup;
  schemeAccForm: UntypedFormGroup;
  timeAccForm: UntypedFormGroup;
  userAccounts: IAccountListResponse[] = [];
  schemeTimeProductGroup: ISchemeTimeProduct[] = [];
  schemeTimeProductList: ISchemeTimeProductList[] = [];
  schemeTerm: ISchemeTerm;
  schemeInstallment: ISchemeInstallment;
  schemeDetails: ISchemeDetails;
  timeAccDetails: ITimeAccDetails;
  timeInfo: ITimeInfo;
  accountBalanceResult = '';
  availableBalanceInWords = '';
  branchId = '';
  branchName=''
  accountNumber = '';
  paymentBranchID='';

  schemeDepForm = false;
  timeDepForm = false;

  schemeAccComponent = false;
  timeAccComponent = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  // ux
  payeeAccProvided = false;
  prodTypeProvided = false;

  submitted = false;
  homeBankBranchList: IHomeBranchInfoResponse[];
  branchSelected:string="";
  //filteredOptions: Observable<IAccountListResponse[]>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private accountOpeningService: AccountOpeningService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.accountSummary.Status !== 'OK') {
        this.popupError = true;
        this.header = 'Failure';
        this.message = data.userAccounts.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
      if (data.schemeTimeGroup.Status !== 'OK') {
        this.popupError = true;
        this.header = 'Failure';
        this.message = data.schemeTimeGroup.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
      this.userAccounts = data.accountSummary.Result as IAccountListResponse[];
      this.schemeTimeProductGroup = data.schemeTimeGroup
        .Result as ISchemeTimeProduct[];
    });

    this.accOpeningForm = this.formBuilder.group({
      ddlPayeeAccNo: [''],
      txtSearchValue: [''],
      ddlProductType: [''],
    });

    this.schemeAccForm = this.formBuilder.group({
      txtSearchValue:[''],
      productId: [''],
      branchId: [''],
      depositAmount: ['0'],
      terms: [''],
      installmentAmount: [''],
    });

    this.timeAccForm = this.formBuilder.group({
      txtSearchValue:[''],
      productId: [''],
      branchId: [''],
      principalAmnt: [
        0,
        [Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],
      ],
      terms: [0, [Validators.required, Validators.pattern('[0-9]+')]],
    });

    // this.filteredOptions = this.f.txtSearchValue.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
  }

  // private _filter(value: string): IAccountListResponse[] {
  //   const filterValue = value.toLowerCase();

  //   return this.userAccounts.filter(option => (option.brancH_ID.toString() + option.accounT_NUMBER.toString()).replace('-','').toLowerCase().includes(filterValue));
  // }
  onChangeBranch(event:any){
    console.log(event)
    this.branchId=event.value.split('_')[0];
    this.branchName=event.value.split('_')[1];
    
    this.s.branchId.setValue(this.branchId);
    
    this.t.branchId.setValue(this.branchId);
    
  }

  get f() {
    return this.accOpeningForm.controls;
  }

  get s() {
    return this.schemeAccForm.controls;
  }

  get t() {
    return this.timeAccForm.controls;
  }

  getAccountDetails(event: any) {    
    if (event.value === '') {
      this.accountBalanceResult = '';
      this.availableBalanceInWords = '';
      this.f.ddlProductType.setValue('');
      this.prodTypeProvided = false;
      this.payeeAccProvided = false;
      return;
    }
    var acc = event.value.split('-');
    this.paymentBranchID = acc[0];
    this.branchId = acc[0];
    this.accountNumber = acc[1];
    
    this.bankAccountService
      .getAccountBalance(this.paymentBranchID, this.accountNumber)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.providePayeeAcc();
          this.accountBalanceResult = Response.Result.availablE_BALANCE;
          this.getAvailableBalanceInWords(this.accountBalanceResult);
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  selectProduct(event: any) {
    this.getHomeBankBranchList();
    let sl = event.target.value;
    let product = this.schemeTimeProductGroup.filter(
      (p) => p.grouP_SL_NO === sl
    )[0];
    if (product) {
      this.provideProdType();
      this.refreshSchemeTimeForm();
      if (product.appL_NAME === 'Schemes Deposit Account') {
        this.schemeDepForm = true;
        this.timeDepForm = false;
      }
      if (product.appL_NAME === 'Time Deposit Account') {
        this.schemeDepForm = false;
        this.timeDepForm = true;
      }
      this.accountOpeningService
        .getSchemeTimeProductList(product)
        .subscribe((response) => {
          if (response.Status === 'OK') {
            this.schemeTimeProductList = response.Result;
          } else if (response.Status === 'UNAUTH') {
            this.authenticationService.logout();
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
        });
    }
  }

  // Scheme
  getSchemeTerms() {
    const productId = this.s.productId.value;
    this.schemeTerm = null;
    if (productId === '') {
      return;
    }
    this.accountOpeningService
      .getSchemeTerms(this.s.productId.value, this.branchId)
      .subscribe((response) => {
        console.log(response)
        if (response.Status === 'OK') {
          this.refreshSchemeTimeForm();
          this.s.productId.setValue(productId)
          this.schemeTerm = response.Result;
          if (this.schemeTerm.termTextBoxShowFlag) {
            this.s.terms.setValue(this.schemeTerm.termsTextBoxData);
            if (!this.schemeTerm.depositamountTextBoxShowFlag) {
              this.getSchemeInstallment();
            }
          } else if (this.schemeTerm.termDropdownShowFlag) {
            this.s.terms.setValue('');
          }
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getSchemeInstallment() {
    this.accountOpeningService
      .getInstallments(
        this.s.productId.value,
        this.branchId,
        this.s.depositAmount.value,
        this.s.terms.value
      )
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.schemeInstallment = response.Result;
          if (this.schemeInstallment.instlmntTextBoxShowFlag) {
            this.s.installmentAmount.setValue(
              this.schemeInstallment.instlmntTextBoxData
            );
          } else if (this.schemeInstallment.instlmntDropdownShowFlag) {
            this.s.installmentAmount.setValue('');
          }
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getSchemeAccountDetails() {
    this.s.branchId.setValue(this.branchId);
    this.accountOpeningService
      .getSchemeAccountDetails(this.schemeAccForm.value)
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.schemeDetails = response.Result;
          this.schemeAccComponent = true;
          this.timeAccComponent = false;
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  // Time
  getTimeInfo() {
    if (this.t.productId.value === '') {
      this.timeInfo = null;
      return;
    }
    this.t.branchId.setValue(this.branchId);
    console.log(this.paymentBranchID+'---'+this.branchId)
    this.accountOpeningService
      .getTimeInfo(this.t.productId.value, this.branchId)
      .subscribe((response) => {
        if (response.Status === 'OK') {
          this.timeInfo = response.Result;
          this.t.branchId.setValue(this.branchId);
          this.t.principalAmnt.setValue(this.timeInfo.principalAmount);
          this.t.terms.setValue(this.timeInfo.terms);
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getTimeAccDetails() {
    this.accountOpeningService
      .getTimeAccountDetails(this.timeAccForm.value)
      .subscribe((response) => {
        if(response.Status === 'OK') {
          this.timeAccDetails = response.Result;
          this.timeAccComponent = true;
          this.schemeAccComponent = false;
        } else if (response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }
  
  // Home Bank Branch
  getHomeBankBranchList() {
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

  checkTermValidation() {
    if (this.timeInfo) {
      if (
        this.t.terms.value < this.timeInfo.termMinvalue ||
        this.t.terms.value > this.timeInfo.termMaxValue
      ) {
        this.t.terms.setErrors({
          minMax: true,
        });
      }
    }
  }

  checkPrincipalAmntValidation() {
    if (this.timeInfo) {
      if (
        this.t.principalAmnt.value < this.timeInfo.principalAmountMinValue ||
        this.t.principalAmnt.value > this.timeInfo.principalAmountMaxValue
      ) {
        this.t.principalAmnt.setErrors({
          minMax: true,
        });
      }
    }
  }

  getAvailableBalanceInWords(availableBalance: string) {
    this.availableBalanceInWords = converter.toWords(availableBalance);
  }

  providePayeeAcc() {
    this.payeeAccProvided = true;
  }

  provideProdType() {
    this.prodTypeProvided = true;
  }

  cancelSchemeAccOpening(event: boolean) {
    this.schemeAccComponent = event;
  }

  cancelTimeAccOpening(event: boolean) {
    this.timeAccComponent = event;
  }

  refreshSchemeTimeForm() {
    this.timeAccForm.reset();
    this.schemeAccForm.reset();
    this.s.productId.setValue('');
    this.s.depositAmount.setValue('0');
    this.s.terms.setValue('');
    this.t.productId.setValue('');

    this.schemeTerm = null;
    this.schemeInstallment = null;
  }

  refreshForm() {
    this.accOpeningForm.reset();
    this.schemeAccForm.reset();
    this.timeAccForm.reset();

    this.f.ddlPayeeAccNo.setValue('');
    this.f.ddlProductType.setValue('');

    this.s.productId.setValue('');
    this.s.depositAmount.setValue('0');
    this.s.terms.setValue('');
    this.t.productId.setValue('');

    this.accountBalanceResult = '';
    this.availableBalanceInWords = '';
    this.branchId = '';
    this.accountNumber = '';
    this.paymentBranchID=''
    this.schemeDepForm = false;
    this.timeDepForm = false;

    this.payeeAccProvided = false;
    this.prodTypeProvided = false;

    this.schemeTerm = null;
    this.schemeInstallment = null;

    this.timeAccDetails = null;
    this.timeInfo = null;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
