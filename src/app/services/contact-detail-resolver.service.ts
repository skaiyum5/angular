import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RootResponse } from '../models/root-response.model';
import { IUserProfileDetailResponse } from '../models/userdetailsprofile.model';
import { AuthenticationService } from './authentication.service';
import { ContactdetailsService } from './contactdetails.service';

@Injectable({
  providedIn: 'root',
})
export class ContactDetailResolverService
  implements Resolve<RootResponse<IUserProfileDetailResponse>>
{
  constructor(
    private service: ContactdetailsService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RootResponse<IUserProfileDetailResponse>> {
    return this.service.getUserProfileDetails().pipe(
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
