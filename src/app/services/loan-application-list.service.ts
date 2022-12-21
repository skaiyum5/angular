import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ILoanApplicationRequest } from '../models/loan_application_request.model';
import { RootResponse } from '../models/root-response.model';
import { AuthenticationService } from './authentication.service';
import { LoanService } from './loan.service';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationListResolver
  implements Resolve<RootResponse<ILoanApplicationRequest[]>>
{
  constructor(
    private loanService: LoanService,
    private authenticationService: AuthenticationService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RootResponse<ILoanApplicationRequest[]>> {
    return this.loanService.getLoanApplicationReqList().pipe(
      map((res) => {
        if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        }
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return EMPTY;
        // Server is busy, please try again later...
      })
    );
  }
}
