import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap,catchError } from "rxjs/operators";

import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).
    pipe( tap(evt => {
          if (evt instanceof HttpResponse) {
            if(evt.body?.Status?.toString() =='UNAUTH'){
              this.authenticationService.logout();
              //location.reload(true);
              window.location.reload();
            }}
            }),catchError(err => {
      console.log(err);
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        //location.reload(true);
        window.location.reload();
      }

      

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
