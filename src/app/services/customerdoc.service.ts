import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { ICustomerProfilePhoto } from '../models/customerdoc.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerDocService {
  constructor(private http: HttpClient) {}

  getCustomerProfilePhoto(): Observable<ICustomerProfilePhoto> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<ICustomerProfilePhoto>(
      `${environment.rootUrl}/api/CustomerDoc/GetCustomerProfilePhoto`,
      { headers: reqHeader }
    );
  }

  saveCustomerProfilePhoto(profilePhotoParam: FormData
  ): Observable<RootResponse<any>> {
    return this.http.post<RootResponse<any>>(
      `${environment.rootUrl}/api/CustomerDoc/SaveCustomerProfilePhoto`,
      profilePhotoParam
    );
  }
}
