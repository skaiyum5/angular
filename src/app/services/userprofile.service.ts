import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { RootResponse } from '../models/root-response.model';
import { IUserBasicProfile } from '../models/userbasicprofile.model';

@Injectable()
export class UserProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<RootResponse<IUserBasicProfile>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.get<RootResponse<IUserBasicProfile>>(`${environment.rootUrl}/api/Profile/GetProfileBasic`, { headers: reqHeader });
  }
}
