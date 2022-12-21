import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

import { IPartnerTypeResponse } from '../models/partner_type.model';
import { IPartnerResponse } from '../models/partner.model';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  constructor(private http: HttpClient) {}

  // Get Partner Type
  getPartnerType(): Observable<RootResponse<IPartnerTypeResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<IPartnerTypeResponse>>(
      `${environment.rootUrl}/api/Partner/GetPartnerTypes`,
      { headers: reqHeader }
    );
  }

  // Get Partner
  getPartners(typeId: string): Observable<RootResponse<IPartnerResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('typeid', typeId);

    return this.http.get<RootResponse<IPartnerResponse>>(
      `${environment.rootUrl}/api/Partner/GetPartners`,
      { headers: reqHeader, params: httpParams }
    );
  }
}
