import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IRecentActivityResponse } from 'src/app/models/user_activity.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UseractivityService } from 'src/app/services/useractivity.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
})
export class UserActivityComponent implements OnInit {
  userActivityForm: UntypedFormGroup;
  userActivityList: IRecentActivityResponse[];

  loading: boolean = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  dataSource = new MatTableDataSource<IRecentActivityResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [   
    'sl',
    'activityAt',
    'activityType',
    'activityNM', 
    'requestedFrom',
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private userActivityService: UseractivityService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.userActivityForm = this.formBuilder.group({
      count: [0, Validators.required],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;    
  }

  // protected initBaseComponent(paginator: MatPaginator): void 
  // {
  //    this.paginator = paginator;   
  //    this.dataSource.paginator = this.paginator;
  //   // the rest of your code
  // }

  get f() {
    return this.userActivityForm.controls;
  }

  showRecentActivities() {
    this.loading = true;
    
    this.userActivityService
      .getRecentActivityLog(this.f.count.value)
      .subscribe((Response) => {              
        if (Response.Status === 'OK') {
          this.userActivityList = Response.Result;
          this.dataSource.data = this.userActivityList;
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {          
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account List Loading Failed';
          this.btnText = 'Try Again';
          this.popup = true;
        }
        this.loading = false;
      });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  resetForm() {
    this.f.count.setValue(0);
    this.dataSource= new MatTableDataSource<IRecentActivityResponse>([]);
  }
}
