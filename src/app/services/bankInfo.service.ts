import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { IBankContact } from '../models/bank_bankinfo.model';

@Injectable({
  providedIn: 'root',
})
export class BankInfoService {
  constructor(private http: HttpClient) {}

  // Get Benefit Type
  getbankContactInfo(): Observable<RootResponse<IBankContact[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<IBankContact[]>>(
      `${environment.rootUrl}/api/BankInfo/About`,
      { headers: reqHeader }
    );
  }
}
