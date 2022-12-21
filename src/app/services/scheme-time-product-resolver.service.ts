import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RootResponse } from '../models/root-response.model';
import { ISchemeTimeProduct } from '../models/scheme_time_product.model';
import { AccountOpeningService } from './account-opening.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SchemeTimeProductResolverService
  implements Resolve<RootResponse<ISchemeTimeProduct[]>>
{
  constructor(
    private accountOpeningService: AccountOpeningService,
    private authenticationService: AuthenticationService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RootResponse<ISchemeTimeProduct[]>> {
    return this.accountOpeningService.getSchemeTimeProductGroup().pipe(
      map((res) => {
        if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        }
        return res;
      }),
      catchError((error) => {
        console.log(error);
        return [];
        // Server is busy, please try again later...
      })
    );
  }
}
