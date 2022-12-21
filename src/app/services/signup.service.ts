import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootResponse } from '../models/root-response.model';
import { ISignup } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  sendSignUpRequest(signupParam: ISignup): Observable<RootResponse<ISignup>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<ISignup>>(`${environment.rootUrl}/api/SignupRequest/Signup`, signupParam, {headers: reqHeader});
  }
}
