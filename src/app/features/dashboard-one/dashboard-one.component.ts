import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenu } from 'src/app/models/menu.model';
import { RootResponse } from 'src/app/models/root-response.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuService } from 'src/app/services/menu.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-one',
  templateUrl: './dashboard-one.component.html',
  styleUrls: ['./dashboard-one.component.css'],
})
export class DashboardOneComponent implements OnInit {
  currentUser: RootResponse<User>;
  menuList: IMenu[] = [];
  menu: IMenu = {
    key: 'E-ACCOUNT',
    title: 'e-Account',
    localTitle: 'প্রোফাইল',
    enabled: true,
    imagePath: `assets/icons/ic_eaccount.png`,
    url: 'https://eaccount.sjiblbd.com/ekyc/Home/Login',
  };

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private menuService: MenuService
  ) {
    this.menuList = this.menuService.getMainMenu();
  }

  ngOnInit(): void {}

  // Test
  // Test by ashikur
}
