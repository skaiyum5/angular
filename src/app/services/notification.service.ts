import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { INotificationResponse } from '../models/notification.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  private _refreshNotifications= new Subject<void>();
  get $refreshNotifications(){
    return this._refreshNotifications;
  };

  // Get Notification
  getAllNotifications(): Observable<RootResponse<INotificationResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<INotificationResponse>>(
      `${environment.rootUrl}/api/Notification/GetAllNotifications`,
      { headers: reqHeader }
    );
  }
  // Update Notification Read Status
  updateNotificationAsRead(notificationID: string): Observable<RootResponse<INotificationResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('hit Update')
    let httpParams = new HttpParams().set('notificationID', notificationID);

    return this.http.get<RootResponse<INotificationResponse>>(
      `${environment.rootUrl}/api/Notification/UpdateNotificationAsRead`,
      { headers: reqHeader, params: httpParams }
    ).pipe(tap(()=> {this._refreshNotifications.next()}));
  }
  
}
