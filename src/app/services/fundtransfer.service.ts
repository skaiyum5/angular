import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IFundTransferTypeResponse, IFundTransfer } from '../models/fundtransfer.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { IBulkFundTransfer } from '../models/bulk_fund_transfer.model';
import { IBulkFundTransferRequest } from '../models/bulk_fund_transfer_request.model';
//import { IUtilitybillpayment } from '../models/utilitybillpayment.model';

@Injectable({
  providedIn: 'root',
})
export class FundTransferService {
  constructor(private http: HttpClient) {}

  // Get Fund Transfer Type List
  getFundTransferTypeList(): Observable<RootResponse<IFundTransferTypeResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IFundTransferTypeResponse>>(
      `${environment.rootUrl}/api/FundTransfer/GetFundTransferList`,
      { headers: reqHeader }
    );
  }

  saveFundTransfer(
    fundTransferParam: IFundTransfer
  ): Observable<RootResponse<IFundTransfer>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post<RootResponse<IFundTransfer>>(
      `${environment.rootUrl}/api/FundTransfer/fundTransfer`,
      fundTransferParam,
      { headers: reqHeader }
    );
  }

  saveExcelForBulkFundTransfer(
    bulkTransferParam: FormData
  ): Observable<RootResponse<IBulkFundTransfer[]>> {
    var reqHeader = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post<RootResponse<IBulkFundTransfer[]>>(
      `${environment.rootUrl}/api/FundTransfer/processExcelForBulkFundTransfer`,
      bulkTransferParam,
      { headers: reqHeader }
    );
  }

  saveBulkFundTransfer(
    bulkTransferParam: IBulkFundTransferRequest
  ): Observable<RootResponse<any>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post<RootResponse<any>>(
      `${environment.rootUrl}/api/FundTransfer/BulkFundTransfer`,
      bulkTransferParam,
      { headers: reqHeader }
    );
  }

  // saveTopUp(topUpParam: IUtilitybillpayment): Observable<any> {
  //   var reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   });

  //   return this.http.post<any>(
  //     `${environment.rootUrl}/api/UtilityBill/UtilityBillPayment`,
  //     topUpParam,
  //     { headers: reqHeader }
  //   );
  // }
}
