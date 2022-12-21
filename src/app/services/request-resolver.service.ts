import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IGetRequestWithDetails } from '../models/requestWithDetails.model';
import { RootResponse } from '../models/root-response.model';
import { AuthenticationService } from './authentication.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class RequestResolverService
  implements Resolve<RootResponse<IGetRequestWithDetails[]>>
{
  constructor(
    private service: RequestService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RootResponse<IGetRequestWithDetails[]>> {
    return this.service
      .getRequests(this.authenticationService.currentUserValue.branchId)
      .pipe(        
        map((res) => {    
          console.log(res);      
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
