import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRequestChangeAddress } from '../models/request-changeaddress.model';
import { IRequestLostCard } from '../models/request-lostcard.model';
import { IRequestOrderCheque } from '../models/request-ordercheque.model';
import { IRequestStatement } from '../models/request-statement.model';
import { IRequestStopCheque } from '../models/request-stopcheque.model';
import { RootResponse } from '../models/root-response.model';
import { IGetRequestWithDetails } from '../models/requestWithDetails.model';
import { IChequeBookDefinitionResponse } from '../models/cheque_chequebookdefinition.model';

import {IRequestComplainSubject, IRequestComplain } from '../models/request-complain.model';
import { IRequestPayOrder } from '../models/request-payorder.model';
import { IRequestPositivePay } from '../models/request-positivepay.model';
import { IRequestPaperCertificate, ICertificateDocType } from '../models/request-papercertificate.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) { }

  sendStatementRequest(
    reqStatementParam: IRequestStatement
  ): Observable<RootResponse<IRequestStatement>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

   return this.http.post<RootResponse<IRequestStatement>>(
      `${environment.rootUrl}/api/Request/RequestStatement`,
      reqStatementParam,
      { headers: reqHeader }
    );
  }

  sendStopChequeRequest(
    reqStopChequeParam: IRequestStopCheque
  ): Observable<RootResponse<IRequestStopCheque>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestStopCheque>>(
      `${environment.rootUrl}/api/Request/RequestStopCheque`,
      reqStopChequeParam,
      { headers: reqHeader }
    );
  }

  sendChangeAddressRequest(
    addressParam: IRequestChangeAddress
  ): Observable<RootResponse<IRequestChangeAddress>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestChangeAddress>>(
      `${environment.rootUrl}/api/Request/RequestChangeAddress`,
      addressParam,
      { headers: reqHeader }
    );
  }

  sendLostCardRequest(
    lostcardParam: IRequestLostCard
  ): Observable<RootResponse<IRequestLostCard>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestLostCard>>(
      `${environment.rootUrl}/api/Request/RequestLostCard`,
      lostcardParam,
      { headers: reqHeader }
    );
  }

  // Cheque Book
  sendOrderChequeRequest(
    reqOrderChequeParam: IRequestOrderCheque
  ): Observable<RootResponse<IRequestOrderCheque>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestOrderCheque>>(
      `${environment.rootUrl}/api/Request/RequestOrderCheque`,
      reqOrderChequeParam,
      { headers: reqHeader }
    );
  }

  getChequeBookDefinition(branchId: string, accountNumber:string): Observable<RootResponse<IChequeBookDefinitionResponse[]>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams()
      .set("branchId", branchId)
      .set("accountNumber", accountNumber);

    return this.http.get<RootResponse<IChequeBookDefinitionResponse[]>>(
      `${environment.rootUrl}/api/BankAccount/GetChequeBookDefinationDetailsList`,
      { headers: reqHeader, params: httpParams }
    )
  }

  // Complain

  getComplainSubject(): Observable<RootResponse<IRequestComplainSubject[]>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
   
    return this.http.get<RootResponse<IRequestComplainSubject[]>>(
      `${environment.rootUrl}/api/Request/GetComplainSubjects`,
      { headers: reqHeader}
    )
  }

  sendComplainRequest(
    reqComplainParam: IRequestComplain
  ): Observable<RootResponse<IRequestComplain>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestComplain>>(
      `${environment.rootUrl}/api/Request/RequestComplain`,
      reqComplainParam,
      { headers: reqHeader }
    );
  }

  sendPayOrderRequest(
    reqPayOrderParam: IRequestPayOrder
  ): Observable<RootResponse<IRequestPayOrder>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestPayOrder>>(
      `${environment.rootUrl}/api/Request/RequestPayOrder`,
      reqPayOrderParam,
      { headers: reqHeader }
    );
  }

  sendPositivePayRequest(
    reqPositivePayParam: IRequestPositivePay
  ): Observable<RootResponse<IRequestPositivePay>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestPositivePay>>(
      `${environment.rootUrl}/api/Request/RequestPositivePay`,
      reqPositivePayParam,
      { headers: reqHeader }
    );
  }

  sendPaperCertificateRequest(
    reqPaperCertificateParam: IRequestPaperCertificate
  ): Observable<RootResponse<IRequestPaperCertificate>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IRequestPaperCertificate>>(
      `${environment.rootUrl}/api/Request/RequestPaperCertificate`,
      reqPaperCertificateParam,
      { headers: reqHeader }
    );
  }

  getPaperCertificateDocType(): Observable<RootResponse<ICertificateDocType>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<RootResponse<ICertificateDocType>>(
      `${environment.rootUrl}/api/Request/GetPaperCertificateDocType`, { headers: reqHeader });
  }

  getRequests(branchId: string): Observable<RootResponse<IGetRequestWithDetails[]>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // let httpParams = new HttpParams()
    //   .set("BranchId", branchId);

    return this.http.get<RootResponse<IGetRequestWithDetails[]>>(
      `${environment.rootUrl}/api/Request/GetRequestsWithDetails`,
      { headers: reqHeader }
    )
  }

}
