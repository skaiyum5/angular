import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IHomeBranchInfoResponse } from '../models/bank_homebankbranchinfo.model';
import { RootResponse } from '../models/root-response.model';
import { AuthenticationService } from './authentication.service';
import { BankAccountService } from './bankaccount.service';

@Injectable({
  providedIn: 'root',
})
export class HomeBankBranchResolverResolver
  implements Resolve<RootResponse<IHomeBranchInfoResponse>>
{
  constructor(
    private bankAccountService: BankAccountService,
    private authenticationService: AuthenticationService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RootResponse<IHomeBranchInfoResponse>> {
    return this.bankAccountService
      .getHomeBankBranchList(route.data['branchType'])
      .pipe(
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
