import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IAccountBalanceResponse } from 'src/app/models/account_balance.model';
import { IAccountInterestResponse } from 'src/app/models/account_interest.model';
import { IChequeBookListResponse } from 'src/app/models/cheque_chequebooklist.model';
import { IAccountListResponse } from '../../../models/account_list.model';
import { ILastNumberofTransactionsResponse } from '../../../models/account_lastnumberoftransactions.model';
import { BankAccountService } from '../../../services/bankaccount.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountDetailsComponent implements OnInit {
  userAccountList: IAccountListResponse[];
  accountDetails: IAccountListResponse = {};
  accountBalance: IAccountBalanceResponse = {};
  //accountInterest: IAccountInterestResponse = {};
  chequeBookList: IChequeBookListResponse[];
  transactionHistory: ILastNumberofTransactionsResponse[];

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';


  dataSource = new MatTableDataSource<IAccountListResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;  

  displayedColumns: string[] = [    
    'accounT_NUMBER',
    'brancH_NM',
    'accounT_TITLE',
    'producT_NM',
    'accounT_STATUS',
    'availablE_BALANCE',
    'outstandinG_BAL',
  ];

  isComponentShow = true;
  isDetailsPopupShow = false;
  loading = false;

  constructor(
    private bankAccountService: BankAccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.accountSummary.Status !== 'OK') {
        this.popupError = true;
        this.header = 'Failure';
        this.message = data.accountSummary.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
      this.dataSource.data = data.accountSummary.Result; 
    });
    if (history.state.accounT_NUMBER) {
      this.showAccountDetails(history.state);
    }    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAccountBalance(branchId: string, accountNmber: string) {
    this.bankAccountService
      .getAccountBalance(branchId, accountNmber)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.accountBalance = Response.Result as IAccountBalanceResponse;
          this.loading = false;
        } else {
          // alert('Account Balance Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account Balance Loading Failed';
          this.btnText = 'Reload';
          this.popup = true;
        }
      });
  }

  // getAccountInterest(branchId: string, accountNmber: string) {
  //   this.bankAccountService
  //     .getAccountInterest(branchId, accountNmber)
  //     .subscribe((Response) => {
  //       if (Response.Status == 'OK') {
  //         this.accountInterest = Response.Result as IAccountInterestResponse;
  //         this.loading = false;
  //       } else {
  //         // alert('Account Interest Loading Failed');
  //         this.popupError = true;
  //         this.header = 'Failure';
  //         this.message = 'Account Profit Loading Failed';
  //         this.btnText = 'Reload';
  //         this.popup = true;
  //       }
  //     });
  // }

  getChequeBookList(branchId: string, accountNmber: string) {
    this.bankAccountService
      .getChequeBookList(branchId, accountNmber)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.chequeBookList = Response.Result as IChequeBookListResponse[];
          this.loading = false;
        } else {
          // alert('Chequebok List Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Chequebok List Loading Failed';
          this.btnText = 'Reload';
          this.popup = true;
        }
      });
  }

  getTransactionHistory(branchId: string, accountNmber: string) {
    this.bankAccountService
      .getTransactionHistory(branchId, accountNmber)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.transactionHistory = Response.Result as any[];
          this.accountDetails.lasT_TRN_DT= this.transactionHistory[0]?.tranS_DATE !==''?this.transactionHistory[0]?.tranS_DATE:this.accountDetails.lasT_TRN_DT;
          this.loading = false;
        } else {
          // alert('Transaction History Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Transaction History Loading Failed';
          this.btnText = 'Reload';
          this.popup = true;
        }
      });
  }

  showAccountDetails(row: IAccountListResponse) {
    this.loading = true;
    this.accountDetails = row;

    this.getAccountBalance(row.brancH_ID, row.accounT_NUMBER);
    //this.getAccountInterest(row.brancH_ID, row.accounT_NUMBER);
    this.getChequeBookList(row.brancH_ID, row.accounT_NUMBER);
    this.getTransactionHistory(row.brancH_ID, row.accounT_NUMBER);

    this.isComponentShow = !this.isComponentShow;
    this.isDetailsPopupShow = !this.isDetailsPopupShow;
  }

  closeDetailsPopup() {
    this.isComponentShow = true;
    this.isDetailsPopupShow = false;
    this.accountDetails = null;
    this.accountBalance = null;
    //this.accountInterest = null;
    this.chequeBookList = null;
    this.transactionHistory = null;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
