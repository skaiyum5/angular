import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { DashboardTwoComponent } from '../dashboard-two/dashboard-two.component';

@Component({
  selector: 'app-dashboard-three',
  templateUrl: './dashboard-three.component.html',
  styleUrls: ['./dashboard-three.component.css']
})
export class DashboardThreeComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

  // onCreate() {
  //   const config = new MatDialogConfig();
  //   config.disableClose = true;
  //   config.autoFocus = true;
  //   config.width = "60%";
  //   this.dialog.open(AdminLoginComponent, config);
  // }

  


}
