import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { IAccountOpeningLog } from '../../../models/account_opeing_log.model';
import { AccountOpeningService } from '../../../services/account-opening.service';
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
  selector: 'app-account-opening-receipt',
  templateUrl: './account-opening-receipt.component.html',
  styleUrls: ['./account-opening-receipt.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AccountOpeningReceiptComponent implements OnInit {
  today = this.calendar.getToday();
  @ViewChild('myForm') myForm: NgForm;
  dataSource = new MatTableDataSource<IAccountOpeningLog>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  accountDetails: IAccountOpeningLog = {};
  accountOpeningLogForm: UntypedFormGroup;

  // Account Opening Log
  accountType: string;
  startDate: any;
  endDate: any;

  // Report
  branchID: string;
  accountNumber: string;
  //reportType: string;
  reportName: string;

  minDate = { year: this.today.year - 50, month: 1, day: 1 };
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
    'accountNo',
    'branchNm',
    'accountTitle',
    'productNm',
    'payeeAccountNo',
    'Download'
  ];

  // exportFormat: [
  //   { text: "PDF", value: 1 },
  //   { text: "EXCEL", value: 2 },
  // ]

  activityType = ActivityType;
  constructor(private userActivityService: UseractivityService,
    private formBuilder: UntypedFormBuilder,
    private accountOpeningService: AccountOpeningService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private calendar: NgbCalendar
  ) { }

  get f() {
    return this.accountOpeningLogForm.controls;
  }

  ngOnInit() {
    this.getAccountOpeningLog();
    // console.log(this.today);
    // this.route.data.subscribe((data) => {
    //   this.userAccountList = data.accountSummary.Result;
    // });

    // this.accountOpeningLogForm = this.formBuilder.group({
    //   ddlAccountType: ['', Validators.required],
    //   txtStartDate: ['', Validators.required],
    //   txtEndDate: ['', Validators.required],
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAccountOpeningLog() {
    this.submitted = true;
    this.loading = true;

    this.accountType = '';
    //this.f.ddlAccountType.value;
    // this.startDate = this.formatDate(this.f.txtStartDate.value);
    // this.endDate = this.formatDate(this.f.txtEndDate.value);

    this.accountOpeningService
      .getAccountOpeningLog(this.accountType)
      .subscribe((Response) => {
        //console.log(Response);
        if (Response.Status == 'OK') {
          this.dataSource.data = Response.Result as IAccountOpeningLog[];
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

  formatDate(value: any): string {
    let date = new Date(value.year, value.month - 1, value.day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  resetForm(): void {
    this.accountOpeningLogForm.reset();
    this.myForm.resetForm();
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  // Generate Receipt
  generateReceipt(row: IAccountOpeningLog, exportFormat: string) {
    this.submitted = true;
    this.loading = true;
    this.accountDetails = row;

    this.branchID = this.accountDetails.branchId;
    this.accountNumber = this.accountDetails.accountNo;
    
    var branchNm =this.accountDetails.branchNm;
    //this.reportType = '1';
    this.reportName = 'Account Opening Receipt : ' + this.branchID + '-' + this.accountNumber;

    this.accountOpeningService
      .generateAccountOpeningReceipt(this.branchID, this.accountNumber, exportFormat)
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.onDownload(Response.Result, exportFormat);
                 // Activity Log
     this.userActivityService.addNewActivity('Account-Opening-Receipt', this.activityType.REQUEST,`The ${branchNm} brance & A/C No : ${this.accountNumber} Account-Opening-Receipt was downloaded.`).subscribe(response => {});
 
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
      this.reportName = this.reportName + ".pdf";
      let base64EncodedPDF = result;
      let dataURI = "data:application/pdf;base64," + base64EncodedPDF;

      let a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none;');
      a.href = dataURI;
      a.download = this.reportName;
      a.click();
      URL.revokeObjectURL(dataURI);
    }
    // else if (exportFormat == '2') {
    //   this.reportName = this.reportName + ".xlsx";
    //   var bytes = new Uint8Array(this.base64ToArrayBuffer(result));

    //   var blob = new Blob([bytes], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   }); // change resultByte to bytes

    //   var link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = this.reportName;
    //   link.click();
    // }
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
