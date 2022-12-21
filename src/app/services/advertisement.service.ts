import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  constructor(private http: HttpClient) {}

  // Get  Advertisement Image base64
  getAdvertisementList(): Observable<RootResponse<string[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let httpParams = new HttpParams()
    .set("channelName", "IBU"); 
    return this.http.get<RootResponse<string[]>>(
      `${environment.rootUrl}/api/BankAccount/GetAdvertisementList`,
      { headers: reqHeader, params: httpParams }
    );
  }
}
