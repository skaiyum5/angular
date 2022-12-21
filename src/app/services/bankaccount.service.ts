import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { IAccountListResponse } from '../models/account_list.model';
import { IRtgsBankList } from '../models/bank_rtgsbanklist.model';
import { IRtgsBranchListResponse } from '../models/bank_rtgsbranchlist.model';
import { IRtgsCountryList } from '../models/bank_rtgscountrylist.model';
import { IAccountBalanceResponse } from '../models/account_balance.model';
import { IAccountInterestResponse } from '../models/account_interest.model';
import { IChequeBookListResponse } from '../models/cheque_chequebooklist.model';

import { IHomeBranchInfoResponse } from '../models/bank_homebankbranchinfo.model';
import { INPSBBankList } from '../models/bank_npsbbanklist.model';
import { IBankInfoResponse } from '../models/bank_bankinfo.model';
import { IBankBranchInfoResponse } from '../models/bank_otherbankbranchinfo.model';
import { ICBSAccInfo } from '../models/cbsAccInfo.model';
import { IBranchTransactionDate } from '../models/branchTransactionDate.model';
import { IEnabledTransactionType } from '../models/enabled_transactiontype.model';

import {
  IUnUsedChequeDetail,
  IUnUsedChequeDetailResponse,
} from '../models/cheque_unusedchequedetail.model';
import { IFinancialTransaction } from '../models/financial-transaction.model';
import { ITransactionReceiptParam, ITransactionReceiptResponse, IDownloadTransactionReceipt } from '../models/transactionReceipt.model';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  constructor(private http: HttpClient) {}

  // Get User's Account List
  getUserAccount(
    accountType: string
  ): Observable<RootResponse<IAccountListResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('accountType', accountType);
    return this.http.get<RootResponse<IAccountListResponse>>(
      `${environment.rootUrl}/api/BankAccount/getAccountListWithBalance`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Account's Balance
  getAccountBalance(
    branchId: string,
    accountNumber: string
  ): Observable<RootResponse<IAccountBalanceResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('accountNumber', accountNumber);

    return this.http.get<RootResponse<IAccountBalanceResponse>>(
      `${environment.rootUrl}/api/BankAccount/getAccountBalance`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Account's Balance
  getAccountInterest(
    branchId: string,
    accountNumber: string
  ): Observable<RootResponse<IAccountInterestResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('accountNumber', accountNumber);

    return this.http.get<RootResponse<IAccountInterestResponse>>(
      `${environment.rootUrl}/api/BankAccount/getAccountInterest`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Account's Balance
  getChequeBookList(
    branchId: string,
    accountNumber: string
  ): Observable<RootResponse<IChequeBookListResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('accountNumber', accountNumber);

    return this.http.get<RootResponse<IChequeBookListResponse>>(
      `${environment.rootUrl}/api/BankAccount/getChequeBookList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getUnUsedChequeDetails(
    chequDetail: IUnUsedChequeDetail
  ): Observable<RootResponse<IUnUsedChequeDetailResponse[]>> {
    let httpParams = new HttpParams()
      .set('branchId', chequDetail.branchId)
      .set('accountNumber', chequDetail.accountNumber)
      .set('chequePrefix', chequDetail.chequePrefix)
      .set('startLeafNo', chequDetail.startLeafNo)
      .set('endLeafNo', chequDetail.endLeafNo);

    return this.http.get<RootResponse<IUnUsedChequeDetailResponse[]>>(
      `${environment.rootUrl}/api/BankAccount/getUnUsedChequeDetail`,
      { params: httpParams }
    );
  }

  // Get Account's Transactions History
  getTransactionHistory(
    branchId: string,
    accountNumber: string
  ): Observable<RootResponse<IChequeBookListResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('accountNumber', accountNumber);

    return this.http.get<RootResponse<IChequeBookListResponse>>(
      `${environment.rootUrl}/api/BankAccount/lastNumberofTransactions`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // CBS Account Information
  getCbsAccInfo(
    branchId: string,
    accountNumber: string
  ): Observable<ICBSAccInfo> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('accountNumber', accountNumber);

    return this.http.get<ICBSAccInfo>(
      `${environment.rootUrl}/api/BankAccount/getCbsAccInfo`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Home Bank Branch
  getHomeBankBranchList(
    nameValueList: string
  ): Observable<RootResponse<IHomeBranchInfoResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('value', nameValueList);

    return this.http.get<RootResponse<IHomeBranchInfoResponse>>(
      `${environment.rootUrl}/api/BankAccount/branchInfo`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getBranchTransactionDate(branchId:string): Observable<IBranchTransactionDate> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('pBranchId', branchId);      

    return this.http.get<IBranchTransactionDate>(
      `${environment.rootUrl}/api/BankAccount/getbranchtransactiondate`,
      { headers: reqHeader, params: httpParams }
    );
  }

  //=================== Other Bank & Branch ==============

  // Get Other Bank List
  getBankList(value: string): Observable<RootResponse<IBankInfoResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('value', value);

    return this.http.get<RootResponse<IBankInfoResponse>>(
      `${environment.rootUrl}/api/BankAccount/bankInfo`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Other Bank Branch List
  getOtherBankBranchList(
    value: string,
    bankId: string
  ): Observable<RootResponse<IBankBranchInfoResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('bankId', bankId).set('value', value);
    return this.http.get<RootResponse<IBankBranchInfoResponse>>(
      `${environment.rootUrl}/api/BankAccount/bankBranchInfo`,
      { headers: reqHeader, params: httpParams }
    );
  }

  //======================================================

  //==================== RTGS =============
  // Get RTGS Bank List
  getRTGSBankList(): Observable<RootResponse<IRtgsBankList>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IRtgsBankList>>(
      `${environment.rootUrl}/api/BankAccount/getRtgsBankList`,
      { headers: reqHeader }
    );
  }

  // Get RTGS Branch List
  getRTGSBranchList(
    bankId: string
  ): Observable<RootResponse<IRtgsBranchListResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('bankId', bankId);

    return this.http.get<RootResponse<IRtgsBranchListResponse>>(
      `${environment.rootUrl}/api/BankAccount/getRtgsBranchList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get RTGS Country List
  getRTGSCountryList(): Observable<RootResponse<IRtgsCountryList>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IRtgsCountryList>>(
      `${environment.rootUrl}/api/BankAccount/getRtgsCountryList`,
      { headers: reqHeader }
    );
  }
  //========================================

  //================= NPSB =================
  // Get NPSB Bank List
  getNPSBBankList(): Observable<RootResponse<INPSBBankList>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<INPSBBankList>>(
      `${environment.rootUrl}/api/BankAccount/getNPSBBankList`,
      { headers: reqHeader }
    );
  }

  getFinancialTransactionDetails(
    transactionType: number,
    branchID: string,
    accountNumber: string,
    fundTransferTypeId: number,
    startDate: string,
    endTime: string
  ): Observable<RootResponse<IFinancialTransaction[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('transactionType', transactionType)
      .set('branchID', branchID)
      .set('accountNumber', accountNumber)
      .set('fundTransferTypeId', fundTransferTypeId)
      .set('count', 500)
      .set('startDate', startDate)
      .set('endTime', endTime);

    return this.http.post<RootResponse<IFinancialTransaction[]>>(
      `${environment.rootUrl}/api/FundTransferDetails/GetStatementDetailsByAccountNumber`, {},
      { headers: reqHeader, params: httpParams }
    );
  }

  getEnabledTransactionType(): Observable<RootResponse<IEnabledTransactionType[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RootResponse<IEnabledTransactionType[]>>(
      `${environment.rootUrl}/api/FundTransferDetails/Get_FT_UT_TransactionTypeList`, {},
      { headers: reqHeader }
    );
  }

  getTransactionReceiptReportDetails(serviceID: string, count: number, startDate: string, endTime: string): Observable<RootResponse<ITransactionReceiptResponse[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('FTandUTServiceID', serviceID)
      .set('count', count)     
      .set('startDate', startDate)
      .set('endTime', endTime);

    return this.http.post<RootResponse<ITransactionReceiptResponse[]>>(
      `${environment.rootUrl}/api/FundTransferDetails/GetTransactionReceiptReportDetails`, {},
      { headers: reqHeader, params: httpParams }
    );
  }

  downloadTransactionReceipt(receiptParam: ITransactionReceiptResponse): Observable<IDownloadTransactionReceipt> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<IDownloadTransactionReceipt>(
      `${environment.reportApiUrl}/api/User/UserTransactionReceiptReport`, receiptParam,
      { headers: reqHeader }
    );
  }


}
