import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoanApplicationRequestDetails } from '../models/loan_applicataion_request_details.model';
import { ILoanApplication } from '../models/loan_application.model';
import { ILoanApplicationRequest } from '../models/loan_application_request.model';
import { ILoanProduct } from '../models/loan_product.model';
import { ILoanProductDocument } from '../models/loan_product_document.model';
import { RootResponse } from '../models/root-response.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(private http: HttpClient) {}

  getLoanProductsList(
    branchId: string
  ): Observable<RootResponse<ILoanProduct[]>> {
    let httpParams = new HttpParams().set('branchId', branchId);

    return this.http.get<RootResponse<ILoanProduct[]>>(
      `${environment.rootUrl}/api/LoanApplication/GetLoanProductsList`,
      { params: httpParams }
    );
  }

  getLoanProductDocumentList(
    productID: string,
    branchId: string
  ): Observable<RootResponse<ILoanProductDocument[]>> {
    let httpParams = new HttpParams()
      .set('branchId', branchId)
      .set('productID', productID);

    return this.http.get<RootResponse<ILoanProductDocument[]>>(
      `${environment.rootUrl}/api/LoanApplication/GetLoanProductDocumentsList`,
      { params: httpParams }
    );
  }

  saveLoanApplication(
    loanApplication: ILoanApplication
  ): Observable<RootResponse<number>> {
    return this.http.post<RootResponse<number>>(
      `${environment.rootUrl}/api/LoanApplication/SaveLoanApplication`,
      loanApplication
    );
  }

  saveLoanDocument(
    loanApplicationParam: FormData
  ): Observable<RootResponse<any>> {
    return this.http.post<RootResponse<any>>(
      `${environment.rootUrl}/api/LoanApplication/SaveLoanDocument`,
      loanApplicationParam
    );
  }

  getLoanApplicationReqList(): Observable<
    RootResponse<ILoanApplicationRequest[]>
  > {
    return this.http.get<RootResponse<ILoanApplicationRequest[]>>(
      `${environment.rootUrl}/api/LoanApplication/GetLoanApplicationRequestList`
    );
  }

  getLoanApplicationReqDetails(
    loanRequestID: string
  ): Observable<RootResponse<ILoanApplicationRequestDetails>> {
    const httpParams = new HttpParams().set('LoanRequestID', loanRequestID);
    return this.http.get<RootResponse<ILoanApplicationRequestDetails>>(
      `${environment.rootUrl}/api/LoanApplication/GetLoanApplicationRequestDetails`,
      {params: httpParams}
    );
  }
}
