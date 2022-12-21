import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { IAccountListResponse } from 'src/app/models/account_list.model';
import { IFinancialTransaction } from 'src/app/models/financial-transaction.model';
import { BankAccountService } from 'src/app/services/bankaccount.service';

@Component({
  selector: 'app-financial-transactions',
  templateUrl: './financial-transactions.component.html',
  styleUrls: ['./financial-transactions.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class FinancialTransactionsComponent implements OnInit {
  transactionForm: UntypedFormGroup;
  userAccountList: IAccountListResponse[];
  financialTransactions: IFinancialTransaction[] = [];

  branchId: string;
  accountNumber: string;

  today = this.calendar.getToday();
  startDate: any;
  endDate: any;

  minDate = { year: this.today.year - 30, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  submitted = false;
  disabled = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private bankAccountService: BankAccountService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountList.Result;
    });

    this.transactionForm = this.formBuilder.group({
      transactionType: ['0', Validators.required],
      accountNumber: ['', Validators.required],
      txtSearchValue: [''],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
    });
  }

  getAccount(event: any) {
    var acc = event.value.split('_');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
  }

  onSubmit() {
    let transactionType = parseInt(this.f.transactionType.value);
    let branchID = this.branchId;
    let accountNumber = this.accountNumber;
    let fundTransferTypeId = 0;
    let startDate = this.formatDate(this.f.startdate.value);
    let endTime = this.formatDate(this.f.enddate.value);

    this.bankAccountService.getFinancialTransactionDetails(
      transactionType,
      branchID,
      accountNumber,
      fundTransferTypeId,
      startDate,
      endTime
    ).subscribe(response => {
      if (response.Status == 'OK') {
        this.financialTransactions = response.Result;
        console.log(this.financialTransactions);
        if(this.financialTransactions?.length<1){
        this.popupError = true;
        this.header = 'No Data Found';
        this.message = 'Financial Transactions  Not Available';
        this.btnText = 'Close';
        this.popup = true;
        }
      } else {
        // alert('Financial Transactions Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Financial Transactions Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  get f() {
    return this.transactionForm.controls;
  }

  onReset() {
    this.submitted = false;
    this.transactionForm.reset();
    this.f.transactionType.setValue('0');
    this.f.accountNumber.setValue('');
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
