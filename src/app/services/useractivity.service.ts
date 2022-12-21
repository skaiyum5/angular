import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRecentActivityResponse, ITopActivityResponse, INewActivity, INewActivityResponse } from '../models/user_activity.model';
import { RootResponse } from '../models/root-response.model';
import { IpServiceService } from '../services/ip-service.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UseractivityService {
   
  newActivity: INewActivity = {};

  constructor(private http: HttpClient,
    private ip:IpServiceService,
    private authenticationService: AuthenticationService,) {}

  getRecentActivityLog(count: number): Observable<RootResponse<IRecentActivityResponse[]>> {
    var httpParams = new HttpParams().set('count', count);

    return this.http.get<RootResponse<IRecentActivityResponse[]>>(
      `${environment.rootUrl}/api/ActivityLog/GetRecentActivityLog`,
      { params: httpParams }
    );
  }

  getTopActivity(count: number): Observable<RootResponse<ITopActivityResponse[]>> {
    var httpParams = new HttpParams().set('count', count);

    return this.http.get<RootResponse<ITopActivityResponse[]>>(
      `${environment.rootUrl}/api/ActivityLog/GetTopActivityLog`,
      { params: httpParams }
    );
  }

  addNewActivity(componentName: string, type: number,customMSG?:string): Observable<INewActivityResponse> {
   let activityMsg=`Entered ${componentName} page`;
   let activityShNM=`User viewed ${componentName}`;
   if(customMSG){
     activityShNM=customMSG;
    }
    activityMsg = this.authenticationService.currentUserValue.userName + " " + activityMsg;
  
  var httpParams = new HttpParams().set('activityMsg', activityMsg)
                                     .set('IpImei', this.authenticationService.currentUserValue.deviceIMEI)  
                                     .set('channel', 'IBU') 
                                     .set('activityShNM', activityShNM) 
                                     .set('type', type);                                
    
    return this.http.post<INewActivityResponse>(`${environment.rootUrl}/api/ActivityLog/AddNewActivity`,'', { params: httpParams });
  }
}
// Entered Account-Details page.', 'User viewed Account-Details'