import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { INotificationResponse } from 'src/app/models/notification.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loggedInUserName: string;
  notificationList: INotificationResponse[];

  loading = false;
  currentTime = '';

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  // images
  logo: string = `assets/images/FSIBL_Logo.png`;
  // logo: string = `assets/images/ctzn.png`;
  userIcon: string = `assets/images/user-icon.png`;
  isFirstLogin: boolean = false;
  userRouterLink: string = '';
  isTpinEnable:boolean=false;
  newNotification: number;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue.isFirstLogin) {
      this.isFirstLogin = true;
      this.userRouterLink = "/account/changepassword";
      this.router.navigate(['/account/changepassword']);
    }
    else {
      this.getNotifications();
      this.notificationService.$refreshNotifications.subscribe(()=>{
        this.getNotifications();
      })
      this.listenRouting();
      this.isFirstLogin = false;
      this.userRouterLink = "/profile/detailprofile";
    }
    this.loggedInUserName =
      this.authenticationService.currentUserValue.userName;
    this.getBDTime();
    this.isTpinEnable=this.authenticationService.currentUserValue.isTPINMendatory;
  }

  logout() {
    this.authenticationService.logout();
  }

  getNotifications() {
    this.newNotification = 0;
    
    this.notificationService.getAllNotifications().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.notificationList = Response.Result as INotificationResponse[];

        for(var index = 0; index < this.notificationList?.length; index++)
        {
          // New Message Count
          if(this.notificationList[index].isRead == false)
          {
            this.newNotification = this.newNotification + 1;
          }
        }          
      } else if (Response.Status === 'UNAUTH') {
        this.logout();
      } else {        
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Notification Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  listenRouting() {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.loading = true;
      }
      if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel ||
        ev instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }

  getBDTime() {
    setInterval(() => {
      const currentTime = new Date();
      const h = currentTime.getUTCHours();
      let bdh = h + 6;
      const m = currentTime.getUTCMinutes();
      const s = currentTime.getUTCSeconds();
      if (bdh >= 12 && bdh < 24) {
        bdh = bdh === 12 ? 12 : bdh % 12;
        this.currentTime = `${bdh}:${m}:${s} PM`;
      } else if (bdh >= 24 || bdh < 12) {
        bdh = bdh === 24 ? 12 : bdh % 12;
        this.currentTime = `${bdh}:${m}:${s} AM`;
      }
    }, 1000);
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
