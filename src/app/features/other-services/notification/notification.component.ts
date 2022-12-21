import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INotificationResponse } from 'src/app/models/notification.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notificationList: INotificationResponse[];
  notification: INotificationResponse;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  // ux
  singleNotification = false;

  constructor(
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
    this.getNotifications(res.data);
    this.notificationService.$refreshNotifications.subscribe(()=>{
      this.getNotifications(res.data);
    })
    });
    // this.notificationService.$refreshNotifications.subscribe(()=>{
    //   this.getNotifications();
    // })
  }

  getNotifications(notificationID?: string) {
    this.notificationService.getAllNotifications().subscribe((Response) => {
      if (Response.Status == 'OK') {        
        const notifications = Response.Result as INotificationResponse[];
        if (notificationID) {
          this.notification = notifications.filter(
            (n) => n.notificationID === notificationID
          )[0];

          this.singleNotification = true;
        } else {
          this.singleNotification = false;
          this.notification = null;
          this.notificationList=notifications;
        } 
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Notification Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
