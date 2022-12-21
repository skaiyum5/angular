import { Component, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ActivityType } from 'src/app/models/app_enum.model';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cloudnetweb';

  userActivity: any;
  userInactive: Subject<any> = new Subject();

  activityType = ActivityType;
  constructor(private userActivityService: UseractivityService,
    private authenticationService: AuthenticationService, private router: Router) {

      this.setTimeout();
        this.userInactive.subscribe(() => {
        this.authenticationService.logout();
        });

    this.router.events.subscribe(event => {
      // if(event instanceof NavigationStart) {
      //   console.log(event);
      // }
      let userName = this.authenticationService.currentUserValue;
      if (userName) {
        if (event instanceof NavigationEnd) {

          const url = event.url;
          let componentName = url.split('/').pop();
          // console.log(`last value - ${componentName}`);
          if (componentName) {
            let activityType =this.activityType.NOTIFICATION;
            if(componentName=== 'encashment'){ activityType=this.activityType.ENCASHMENT}
            if (componentName !== 'login?returnUrl=%2F') {

              // console.log(`User Login then view --> ${componentName}--type=> ${activityType}`);
              // // // Activity Log
              this.userActivityService.addNewActivity(componentName, activityType).subscribe(response => {});

            }
          }
        }
      }
    })
  }
  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1000000);
  }
  keyPress(event: KeyboardEvent): void {
    clearTimeout(this.userActivity);
    this.setTimeout();
}
// setTimeout(): void {
//     this.userActivity = setTimeout(() => this.userInactive.next(undefined), 900000);
// }

@HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
}
}
