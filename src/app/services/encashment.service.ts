import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { RootResponse } from '../models/root-response.model';

import { IEncashmentAccountParam, IEncashmentAccountDetailsResponse } from '../models/encashment_accountdetails.model';
import { ICreateEncashmentRequest } from '../models/encashment_createrequest.model';
import { IGetEncashmentRequest } from '../models/encashment_getrequest.model';

@Injectable({
  providedIn: 'root'
})
export class EncashmentService {

  constructor(private http: HttpClient) { }

   // Get Scheme Account's Details 
   getSchemeAccountDetails(param:IEncashmentAccountParam): Observable<RootResponse<IEncashmentAccountDetailsResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams().set('encashmentBranchID', param.encashmentBranchID)
                                     .set('encashmentAccountNo', param.encashmentAccountNo)                                     

    return this.http.post<RootResponse<IEncashmentAccountDetailsResponse>>(`${environment.rootUrl}/api/EncashmentRequest/GetEncashmentSchemeAccountDetails`,'', { headers: reqHeader, params: httpParams });
  }
  
  // Get Time Account's Details 
  getTimeAccountDetails(param:IEncashmentAccountParam): Observable<RootResponse<IEncashmentAccountDetailsResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams().set('encashmentBranchID', param.encashmentBranchID)
                                     .set('encashmentAccountNo', param.encashmentAccountNo)                                                                       

    return this.http.post<RootResponse<IEncashmentAccountDetailsResponse>>(`${environment.rootUrl}/api/EncashmentRequest/GetEncashmentTimeAccountDetails`,param, { headers: reqHeader, params: httpParams });
  }

 // Create Scheme Account Encashment Request 
 saveEncashmentForSchemeAccount(param:ICreateEncashmentRequest): Observable<RootResponse<ICreateEncashmentRequest>> {
  var reqHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  let httpParams = new HttpParams().set('encashmentBranchID', param.encashmentBranchID)
                                   .set('encashmentAccountNo', param.encashmentAccountNo)    
                                   .set('payeeBranchID', param.payeeBranchID) 
                                   .set('payeeAccountNo', param.payeeAccountNo)                                                                    

  return this.http.post<RootResponse<ICreateEncashmentRequest>>(`${environment.rootUrl}/api/EncashmentRequest/SaveEncashmentForSchemeAccount`,param, { headers: reqHeader, params: httpParams });
}


// Create Time Account Encashment Request 
saveEncashmentForTimeAccount(param:ICreateEncashmentRequest): Observable<RootResponse<ICreateEncashmentRequest>> {
  var reqHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  let httpParams = new HttpParams().set('encashmentBranchID', param.encashmentBranchID)
                                   .set('encashmentAccountNo', param.encashmentAccountNo)    
                                   .set('payeeBranchID', param.payeeBranchID) 
                                   .set('payeeAccountNo', param.payeeAccountNo)                                                                    

  return this.http.post<RootResponse<ICreateEncashmentRequest>>(`${environment.rootUrl}/api/EncashmentRequest/SaveEncashmentForTimeAccount`,param, { headers: reqHeader, params: httpParams });
}

}
