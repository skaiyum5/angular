import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAccountListResponse } from 'src/app/models/account_list.model';
import { IMenu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { ITopActivityResponse } from 'src/app/models/user_activity.model';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare const $: any;

@Component({
  selector: 'app-dashboard-two',
  templateUrl: './dashboard-two.component.html',
  styleUrls: ['./dashboard-two.component.css'],
})
export class DashboardTwoComponent implements OnInit {
  menuList: IMenu[] = [];
  userDetails = 'User Details';
  topActivity = 'Top Activity';
  userAccounts: IAccountListResponse[] = [];
  topActivityList: ITopActivityResponse[];
  
  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private activityService: UseractivityService,
    private loginUser: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {   
    //
    if(this.loginUser.currentUserValue.isFirstLogin)
    {
      this.router.navigate(['/account/changepassword']);
    }    

    this.route.data.subscribe((data) => {      
      if (data.userAccounts.Status !== 'OK') {
        this.popupError = true;
        this.header = 'Failure';
        this.message = data.userAccounts.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
      this.userAccounts = data.userAccounts.Result as IAccountListResponse[];
    });
    this.menuList = this.menuService.getMainMenu();
    localStorage.setItem('menu', JSON.stringify(this.menuList));

    this.getToActivity(5);

    // if (window.matchMedia('(max-width: 767px)').matches) {
    //   alert('Mobile View');
    // } 
  }

  // showBalance() {
  //   this.balVisibile = true;

  //   setTimeout(() => {
  //     this.balVisibile = false;
  //   },4000);
  // }

  ngAfterViewInit() {
    $('#accountSlider').carousel();
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  getToActivity(count: number) {
    this.activityService.getTopActivity(count).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.topActivityList = Response.Result; 
      } 
      // else {
      //   this.popupError = true;
      //   this.header = 'Failure';
      //   this.message = 'Top Activity Loading Failed';
      //   this.btnText = 'Close';
      //   this.popup = true;
      // }
    });
  }
}
