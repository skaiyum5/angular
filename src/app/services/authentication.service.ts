import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RootResponse } from "../models/root-response.model";
import { environment } from "src/environments/environment";
import { User, IsValidUserID } from "../models/user.model";
import { Router } from "@angular/router";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, imeiOrIP: string, otp: string = "", tpin: string = "") {
    
    return this.http.post<RootResponse<User>>(`${environment.rootUrl}/api/Login/Login`, {
      username, password, imeiOrIP, otp, tpin
    })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user.Result));
        this.currentUserSubject.next(user.Result);        
        return user;
      }));
  }

  isValidUserID(UserID: string): Observable<IsValidUserID> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('UserID', UserID);
    return this.http.get<IsValidUserID>(
      `${environment.rootUrl}/api/Login/isValidUserID`,
      { headers: reqHeader, params: httpParams }
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.http.get(`${environment.rootUrl}/api/SignoutRequest/SignOut`,{}).subscribe();
    localStorage.removeItem('currentUser');
    localStorage.clear();
    window.localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
   
  }
}
