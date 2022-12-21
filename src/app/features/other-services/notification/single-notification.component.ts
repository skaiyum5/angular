import { Component, Input, OnInit } from '@angular/core';
import { INotificationResponse } from 'src/app/models/notification.model';
import { NotificationService } from 'src/app/services/notification.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.css'],
})
export class SingleNotificationComponent implements OnInit {
  @Input() notification: INotificationResponse;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if(!this.notification.isRead){
      this.updateNotificationAsRead(this.notification.notificationID);
    }
  }

  updateNotificationAsRead(notificationID: string) {   
    this.notificationService
      .updateNotificationAsRead(notificationID)
      .subscribe((Response) => {});
  }
}
