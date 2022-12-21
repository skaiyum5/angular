import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  IStatementDetails,
  IStatementDetailsResponse,
  IDownloadStatementParam,
  IDownloadStatementResponse
} from '../models/statementdetails.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserstatementService {
  constructor(private http: HttpClient) {}

  getUserStatement(
    statementParam: IStatementDetails,
    startDate: string,
    endDate: string
  ): Observable<RootResponse<IStatementDetailsResponse>> {
    let httpParams = new HttpParams()
      .set('branchId', `${statementParam.branchID}`)
      .set('accountNumber', `${statementParam.accountNumber}`)
      .set('makeBy', '')
      .set('transMode', '')
      .set('FromDate', startDate)
      .set('ToDate', endDate);

    return this.http.get<RootResponse<IStatementDetailsResponse>>(
      `${environment.rootUrl}/api/BankAccount/lastNumberofTransactionsDateWise`,
      { params: httpParams }
    );
  }

  downloadUserStatement(
    downloadParam: IDownloadStatementParam
  ): Observable<IDownloadStatementResponse> {
    let httpParams = new HttpParams()
      .set('branchId', `${downloadParam.branchId}`)
      .set('accountNumber', `${downloadParam.accountNumber}`)
      .set('makeBy', `${downloadParam.makeBy}`)
      .set('transMode', `${downloadParam.transMode}`)
      .set('FromDate', `${downloadParam.FromDate}`)
      .set('ToDate', `${downloadParam.ToDate}`)
      .set('reportType', `${downloadParam.reportType}`);

    return this.http.get<IDownloadStatementResponse>(
      `${environment.reportApiUrl}/api/User/UserStatementDetailsReport`,
      { params: httpParams }
    );
  }
}
