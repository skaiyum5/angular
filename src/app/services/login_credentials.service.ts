import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPasswordChange, ITpinChange, IPasswordOrTpinRecovery, ITPinRecovery, IUserIDRecovery } from '../models/login_credentials.model';
import { RootResponse } from '../models/root-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginCredentialService {

  constructor(private http: HttpClient) { }

  changePassword(passwordParam: IPasswordChange): Observable<RootResponse<IPasswordChange>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IPasswordChange>>(`${environment.rootUrl}/api/Password/ChangePassword`, passwordParam, { headers: reqHeader});
  }

  changePin(pinParam: ITpinChange): Observable<RootResponse<ITpinChange>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // let httpParams = new HttpParams().set("userName", pinParam.userName)
    //   .set("oldTpin", pinParam.oldTpin)
    //   .set("newTpin", pinParam.newTpin)
    //   .set("confirmTpin", pinParam.confirmTpin);

    //   {
  //     "Status": "OK",
  //     "Message": "Pin successfully changed",
  //     "Result": null
  // }
    
    return this.http.post<RootResponse<ITpinChange>>(`${environment.rootUrl}/api/Password/ChangeTpin`, pinParam, { headers: reqHeader });
  }


  // Self-Recovery
  PasswordRecovery(passwordParam: IPasswordOrTpinRecovery): Observable<RootResponse<IPasswordOrTpinRecovery>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IPasswordOrTpinRecovery>>(`${environment.rootUrl}/api/PasswordResetRequest/ForgetPassword`, passwordParam, {headers: reqHeader});
  }

  TPinRecovery(tpinParam: ITPinRecovery): Observable<RootResponse<ITPinRecovery>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<ITPinRecovery>>(`${environment.rootUrl}/api/PasswordResetRequest/ForgetTPIN`, tpinParam, {headers: reqHeader});
  }

  UserIDRecovery(recoveryParam: IUserIDRecovery): Observable<RootResponse<IUserIDRecovery>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<RootResponse<IUserIDRecovery>>(`${environment.rootUrl}/api/SelfUserIDRecovery/SelfUserIDRecovery`, recoveryParam, {headers: reqHeader});
  }
}
