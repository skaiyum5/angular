import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootResponse } from '../models/root-response.model';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient) { }

  verifyMobile(verificationCode: string, mobileNumber: string, branchID: string, accountNumber: string): Observable<RootResponse<any>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams()
    .set("verificationCode", verificationCode)
    .set("mobileNumber", mobileNumber)
    .set("branchID", branchID)
    .set("accountNumber", accountNumber);

    return this.http.post<RootResponse<any>>(`${environment.rootUrl}/api/Verification/MobileVerification`, {}, { headers: reqHeader, params: httpParams });
  }

  verifyEmail(verificationCode: string, emailAddress: string, branchID: string, accountNumber: string): Observable<RootResponse<any>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams()
    .set("verificationCode", verificationCode)
    .set("emailAddress", emailAddress)
    .set("branchID", branchID)
    .set("accountNumber", accountNumber);

    return this.http.post<RootResponse<any>>(`${environment.rootUrl}/api/Verification/EmailVerification`, {}, { headers: reqHeader, params: httpParams });
  }
}
