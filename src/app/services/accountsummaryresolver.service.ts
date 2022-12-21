import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IAccountListResponse } from '../models/account_list.model';
import { RootResponse } from '../models/root-response.model';
import { AuthenticationService } from './authentication.service';
import { BankAccountService } from './bankaccount.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsummaryresolverService
  implements Resolve<RootResponse<IAccountListResponse>>
{
  constructor(
    private bankAccountService: BankAccountService,
    private authenticationService: AuthenticationService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RootResponse<IAccountListResponse>> {
    return this.bankAccountService.getUserAccount(route.data['accountType']).pipe(
      map((res) => {
        if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        }
        return res;
      }),
      catchError((error) => {
        console.log(error);
        return EMPTY;
        // Server is busy, please try again later...
      })
    );
  }
}
