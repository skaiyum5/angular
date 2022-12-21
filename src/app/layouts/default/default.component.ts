import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user.model';
import { RootResponse } from 'src/app/models/root-response.model';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { IMenu } from 'src/app/models/menu.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
})
export class DefaultComponent implements OnInit {
  sidebarOpen = true;
  loading = false;

  menus: IMenu[];

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  currentUser: RootResponse<User>;

  breadcrumbs: string[] = [];
  routerUrl: string = '/';
  title: string = '';

  constructor(
    private router: Router,
    private loginUser: AuthenticationService
  ) {}

  ngOnInit(): void {

    if(this.loginUser.currentUserValue.isFirstLogin)
    {
      this.router.navigate(['/account/changepassword']);
    } 
    else
    {
    this.listenRouting();
    }
  }

  handleNotify() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // .pipe(filter((event) => event instanceof NavigationEnd))

  // listenRouting() {
  //   this.router.events
  //     .subscribe((ev) => {
  //       this.routerUrl = this.router.url;

  //       if (this.routerUrl && typeof this.routerUrl === 'string') {
  //         let breadcrumbs: string[] = [];
  //         breadcrumbs.push('Home');
  //         this.routerUrl.slice(1).split('/').forEach(breadcrumb => {
  //           breadcrumbs.push(this.transform(breadcrumb));
  //         });
  //         this.breadcrumbs = breadcrumbs;
  //       }

  //       if (ev instanceof NavigationStart) {
  //         this.loading = true;
  //       }
  //       if (
  //         ev instanceof NavigationEnd ||
  //         ev instanceof NavigationCancel ||
  //         ev instanceof NavigationError
  //       ) {
  //         this.loading = false;
  //       }
  //     });
  // }

  listenRouting() {
    this.router.events.subscribe((ev) => {
      this.routerUrl = this.router.url;
      this.menus = JSON.parse(localStorage.getItem('menu'));

      if (this.routerUrl === '/profile/detailprofile') {
        this.title = 'Profile';
      } else if (this.routerUrl === '/account/changepassword') {
        this.title = 'Change Password';
      } else if (this.routerUrl === '/account/change-tpin') {
        this.title = 'Change TPIN';
      } else if (this.routerUrl === '/activity/useractivity') {
        this.title = 'Activity Log';
      } else if (this.routerUrl === '/otherservices/notifications') {
        this.title = 'Notifications';
      } else if (this.routerUrl.includes('/otherservices/notifications;data')) {
        this.title = 'Notification Details';
      } else if (this.routerUrl === '/transactions/bulk-transfer') {
        this.title = 'Fund Transfer';
      } else if (this.routerUrl.includes('/investment/details')) {
        this.title = 'Investment Details';
      } else if (this.routerUrl.includes('/securityadvice')) {
        this.title = 'Security Advice';
      } else if (this.routerUrl.includes('/transactions/fundtransfer')){
        this.title = 'Fund Transfer';
      }else if (this.routerUrl.includes('/utility/billpayment')){
        this.title = 'Bill Pay';
      }

      this.menus?.forEach((menu) => {
        if (menu.url) {
          if (menu.url === this.routerUrl) {
            this.title = menu.title;
          }
        } else {
          if (menu.children.some((m) => m.url === this.routerUrl)) {
            this.title = menu.children.find(
              (m) => m.url === this.routerUrl
            ).title;
          }
        }
      });

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
}
