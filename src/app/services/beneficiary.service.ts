import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { RootResponse } from '../models/root-response.model';
import { IBeneficiary } from '../models/beneficiary.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  constructor(private http: HttpClient) { }

  // Get User's Beneficiary List 
  getBeneficiary(beneficiaryType: string): Observable<RootResponse<IBeneficiary>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let httpParams = new HttpParams().set('BeneficiaryType', beneficiaryType);
    return this.http.get<RootResponse<IBeneficiary>>(`${environment.rootUrl}/api/Beneficiary/GetBeneficiaryList`, { headers: reqHeader, params: httpParams });
  }

  saveBeneficiary(beneficiary:IBeneficiary): Observable<RootResponse<IBeneficiary>> {        
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
   });                             
   
    return this.http.post<RootResponse<IBeneficiary>>(`${environment.rootUrl}/api/Beneficiary/AddBeneficiary`, beneficiary, { headers: reqHeader });
  }

  updateBeneficiary(beneficiary:IBeneficiary): Observable<RootResponse<IBeneficiary>> {        
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
   });                             
   
    return this.http.post<RootResponse<IBeneficiary>>(`${environment.rootUrl}/api/Beneficiary/UpdateBeneficiary`, beneficiary, { headers: reqHeader });
  }

  deleteBeneficiary(beneficiary:IBeneficiary): Observable<RootResponse<IBeneficiary>> {        
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
   });                             
   
    return this.http.post<RootResponse<IBeneficiary>>(`${environment.rootUrl}/api/Beneficiary/DeleteBeneficiary`, beneficiary, { headers: reqHeader });
  }
}
