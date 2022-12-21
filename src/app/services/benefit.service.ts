import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

import { IBenefitTypeResponse } from '../models/benefit_type.model';
import { IBenefitResponse } from '../models/benefit.model';

@Injectable({
  providedIn: 'root',
})
export class BenefitsService {
  constructor(private http: HttpClient) {}

  // Get Benefit Type
  getBenefitType(): Observable<RootResponse<IBenefitTypeResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<IBenefitTypeResponse>>(
      `${environment.rootUrl}/api/Benefit/GetBenefitTypes`,
      { headers: reqHeader }
    );
  }

  // Get Beneficiary
  getBenefits(typeId: string): Observable<RootResponse<IBenefitResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('typeid', typeId);

    return this.http.get<RootResponse<IBenefitResponse>>(
      `${environment.rootUrl}/api/Benefit/GetBenefits`,
      { headers: reqHeader, params: httpParams }
    );
  }
}
