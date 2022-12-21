import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootResponse } from '../models/root-response.model';
import { ISchemeAccountDetailsReq } from '../models/scheme_account_details_req.model';
import { ISchemeAccountReq } from '../models/scheme_account_req.model';
import { ISchemeDetails } from '../models/scheme_details.model';
import { ISchemeInstallment } from '../models/scheme_installment.model';
import { ISchemeTerm } from '../models/scheme_terms.model';
import {
  ISchemeTimeProduct,
  ISchemeTimeProductList,
} from '../models/scheme_time_product.model';
import { ITimeAccountReq } from '../models/time_account_req.model';
import { ITimeAccDetails } from '../models/time_acc_details.model';
import { ITimeAccDetailsReq } from '../models/time_acc_details_req.model';
import { ITimeInfo } from '../models/time_info.model';
import { IAccountOpeningLog, IAccountOpeningReceipt } from '../models/account_opeing_log.model';

@Injectable({
  providedIn: 'root',
})
export class AccountOpeningService {
  constructor(private http: HttpClient) {}

  getSchemeTimeProductGroup(): Observable<RootResponse<ISchemeTimeProduct[]>> {
    return this.http.post<RootResponse<ISchemeTimeProduct[]>>(
      `${environment.rootUrl}/api/AccountOpening/GetSchemeTimeProductGroup`,
      {}
    );
  }

  getSchemeTimeProductList(
    param: ISchemeTimeProduct
  ): Observable<RootResponse<ISchemeTimeProductList[]>> {
    return this.http.post<RootResponse<ISchemeTimeProductList[]>>(
      `${environment.rootUrl}/api/AccountOpening/GetSchemeTimeProductList`,
      param
    );
  }

  getSchemeTerms(
    productId: string,
    branchId: string
  ): Observable<RootResponse<ISchemeTerm>> {
    let httpParams = new HttpParams()
      .set('productID', productId)
      .set('branchID', branchId);

    return this.http.post<RootResponse<ISchemeTerm>>(
      `${environment.rootUrl}/api/AccountOpening/GetSchemeTerms`,
      {},
      { params: httpParams }
    );
  }

  getInstallments(
    productId: string,
    branchId: string,
    depositAmount: string,
    terms: string
  ): Observable<RootResponse<ISchemeInstallment>> {
    let httpParams = new HttpParams()
      .set('productID', productId)
      .set('branchID', branchId)
      .set('depositAmount', depositAmount)
      .set('terms', terms);

    return this.http.post<RootResponse<ISchemeInstallment>>(
      `${environment.rootUrl}/api/AccountOpening/GetSchemeInstallments`,
      {},
      { params: httpParams }
    );
  }

  getSchemeAccountDetails(
    schemeAccParam: ISchemeAccountDetailsReq
  ): Observable<RootResponse<ISchemeDetails>> {
    return this.http.post<RootResponse<ISchemeDetails>>(
      `${environment.rootUrl}/api/AccountOpening/GetSchemeAccountDetails`,
      schemeAccParam
    );
  }

  openSchemeAccount(schemeAccParam: ISchemeAccountReq): Observable<RootResponse<any>> {
    return this.http.post<RootResponse<any>>(
      `${environment.rootUrl}/api/AccountOpening/OpenSchemeAccount`,
      schemeAccParam
    );
  }

  getTimeInfo(productId: string, branchId: string): Observable<RootResponse<ITimeInfo>> {
    let httpParams = new HttpParams()
      .set('productID', productId)
      .set('branchID', branchId);

    return this.http.post<RootResponse<ITimeInfo>>(
      `${environment.rootUrl}/api/AccountOpening/GetTimeinfo`,
      {},
      { params: httpParams }
    );
  }

  getTimeAccountDetails(timeAccParam: ITimeAccDetailsReq): Observable<RootResponse<ITimeAccDetails>> {
    return this.http.post<RootResponse<ITimeAccDetails>>(
      `${environment.rootUrl}/api/AccountOpening/GetTimeAccountDetails`,
      timeAccParam
    );
  }

  openTimeAccount(timeAccParam: ITimeAccountReq): Observable<RootResponse<any>> {
    return this.http.post<RootResponse<any>>(
      `${environment.rootUrl}/api/AccountOpening/OpenTimeAccount`,
      timeAccParam
    );
  }

  getAccountOpeningLog(accountType: string): Observable<RootResponse<IAccountOpeningLog[]>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams()
      .set("accountType", accountType)
      // .set("startDate", startDate)
      // .set("endTime", endTime);
     
    return this.http.get<RootResponse<IAccountOpeningLog[]>>(
      `${environment.rootUrl}/api/AccountOpening/AccountOpeningLog`,
      { headers: reqHeader, params: httpParams }
    )
  }

  generateAccountOpeningReceipt(branchID: string, accountNumber: string, reportType:string): Observable<IAccountOpeningReceipt> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams()
      .set("branchID", branchID)
      .set("accountNumber", accountNumber)
      .set("reportType", reportType);
     
    return this.http.get<IAccountOpeningReceipt>(
      `${environment.reportApiUrl}/api/User/AccopuntOpeningReceipt`,
      { headers: reqHeader, params: httpParams }
    )
  }
}
