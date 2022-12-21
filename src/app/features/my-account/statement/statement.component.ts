import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { IAccountListResponse } from '../../../models/account_list.model';
import {
  IStatementDetails,
  IStatementDetailsResponse,
  IDownloadStatementParam,
  IDownloadStatementResponse,
} from '../../../models/statementdetails.model';
import { UserstatementService } from '../../../services/userstatement.service';
import { DatePipe } from '@angular/common';
import {
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivityType } from 'src/app/models/app_enum.model';
import { UseractivityService } from 'src/app/services/useractivity.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class StatementComponent implements OnInit {
  today = this.calendar.getToday();
  @ViewChild('myForm') myForm: NgForm;
  dataSource = new MatTableDataSource<IStatementDetailsResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  statementForm: UntypedFormGroup;
  userStatementResult: IStatementDetailsResponse[];
  userStatementParam: IStatementDetails = {
    branchID: '',
    accountNumber: '0',
    fundTransferTypeId: '0',
    count: '500',
    startDate: '',
    endTime: '',
  };

  downloadStatementParam: IDownloadStatementParam = {};

  userAccountList: IAccountListResponse[];
  branchId: string;
  accountNumber: string;
  startDate: any;
  endDate: any;
  reportName: string;

  minDate = { year: this.today.year - 30, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };
  loading = false;
  submitted: boolean = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  displayedColumns: string[] = [
    'tranS_DATE',
    'narration',
    'dR_AMOUNT',
    'cR_AMOUNT',
    'balance',
  ];

  activityType = ActivityType;
  constructor(
    private userActivityService: UseractivityService,
    private formBuilder: UntypedFormBuilder,
    private userStatementService: UserstatementService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private calendar: NgbCalendar
  ) {}

  get f() {
    return this.statementForm.controls;
  }

  ngOnInit() {
    console.log(this.today);
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.statementForm = this.formBuilder.group({
      ddlAccountNumber: ['', Validators.required],
      txtSearchValue: [''],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      //ddlExportType: ['1'],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAccountAndBranch(event: any) {
    var acc = event.value.split('-');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
  }
  // Button Show
  getUserStatement() {
    this.submitted = true;
    this.loading = true;
    this.userStatementParam.branchID = this.branchId;
    this.userStatementParam.accountNumber = this.accountNumber;
    this.startDate = this.formatDate(this.f.startdate.value);
    this.endDate = this.formatDate(this.f.enddate.value);

    this.userStatementService
      .getUserStatement(this.userStatementParam, this.startDate, this.endDate)
      .subscribe((Response) => {
        console.log(this.userStatementParam);
        console.log(Response);
        if (Response.Status == 'OK') {
          this.dataSource.data = Response.Result as IStatementDetailsResponse[];
          // Activity Log
          this.userActivityService
            .addNewActivity(
              'Statement',
              this.activityType.NOTIFICATION,
              `The Statement for A/C No: ${this.accountNumber} Statement was Shown.`
            )
            .subscribe((response) => {});
        } else {
          // alert('Statement Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Statement Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loading = false;
      });
  }

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  resetForm(): void {
    this.statementForm.reset();
    this.myForm.resetForm();
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  // Download Statement
  generateStatement() {
    this.submitted = true;
    this.loading = true;

    this.downloadStatementParam.branchId = this.branchId;
    this.downloadStatementParam.accountNumber = this.accountNumber;
    this.downloadStatementParam.FromDate = this.formatDate(
      this.f.startdate.value
    );
    this.downloadStatementParam.ToDate = this.formatDate(this.f.enddate.value);
    this.downloadStatementParam.makeBy = '';
    this.downloadStatementParam.transMode = '';
    this.downloadStatementParam.reportType = '1'; // PDF
    //this.f.ddlExportType.value;

    this.reportName = 'Statement : ' + this.branchId + '-' + this.accountNumber;

    this.userStatementService
      .downloadUserStatement(this.downloadStatementParam)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.onDownload(
            Response.Result,
            this.downloadStatementParam.reportType
          );
          // Activity Log
          this.userActivityService
            .addNewActivity(
              'Statement',
              this.activityType.NOTIFICATION,
              `The A/C No: ${this.downloadStatementParam.accountNumber} Statement was downloaded`
            )
            .subscribe((response) => {});
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loading = false;
      });
  }

  onDownload(result: any, exportFormat: string) {
    if (exportFormat == '1') {
      this.reportName = this.reportName + '.pdf';
      let base64EncodedPDF = result;
      let dataURI = 'data:application/pdf;base64,' + base64EncodedPDF;

      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none;');
      a.href = dataURI;
      a.download = this.reportName;
      a.click();
      URL.revokeObjectURL(dataURI);
    } else if (exportFormat == '2') {
      this.reportName = this.reportName + '.xlsx';
      var bytes = new Uint8Array(this.base64ToArrayBuffer(result));

      var blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }); // change resultByte to bytes

      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.reportName;
      link.click();
    }
  }

  base64ToArrayBuffer(base64: any) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
