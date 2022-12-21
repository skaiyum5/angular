import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { IEnabledTransactionType } from '../../../models/enabled_transactiontype.model';
import { ITransactionReceiptResponse, IDownloadTransactionReceipt } from '../../../models/transactionReceipt.model'
import { BankAccountService } from '../../../services/bankaccount.service';
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
  selector: 'app-user-transaction-receipt',
  templateUrl: './user-transaction-receipt.component.html',
  styleUrls: ['./user-transaction-receipt.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class UserTransactionReceiptComponent implements OnInit {
  today = this.calendar.getToday();
  @ViewChild('myForm') myForm: NgForm;
  dataSource = new MatTableDataSource<ITransactionReceiptResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  transactionReceiptForm: UntypedFormGroup;
  availableServivce: IEnabledTransactionType[];
  userTransactionList: ITransactionReceiptResponse[];
  userTransactionDetails:ITransactionReceiptResponse = {};  
  downloadTransactionReceipt: IDownloadTransactionReceipt = {};
  
  serviceID: string;  
  serviceName: string;
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
    'transactioN_DATE_NM',
    'transfeR_TYPE_NM',    
    'froM_ACCOUNT_NO',
    'tO_ACCOUNT_NO',
    'amounT_CCY', 
    'Action'   
    ];

  activityType = ActivityType;
  constructor(
    private userActivityService: UseractivityService,
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private calendar: NgbCalendar
  ) {}

  get f() {
    return this.transactionReceiptForm.controls;
  }

  ngOnInit() {
    this.transactionReceiptForm = this.formBuilder.group({
      ddlServiceType: ['0', Validators.required],
      txtSearchService: [''],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],     
    });

   this.getAvailableServiceList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  getAvailableServiceList() {
    this.bankAccountService.getEnabledTransactionType().subscribe((Response) => {
      if (Response.Status == 'OK') {
        console.log(Response);
        this.availableServivce = Response.Result as IEnabledTransactionType[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getServiceDetails(event: any) {
    var service = event.value.split('-');
    this.serviceID = service[0];
    this.serviceName = service[1];
  }

  getTransactionList() {
    this.submitted = true;
    this.loading = true;
      
    this.startDate = this.formatDate(this.f.startdate.value);
    this.endDate = this.formatDate(this.f.enddate.value);
     
    console.log(this.serviceID, this.startDate, this.endDate);
    this.bankAccountService
      .getTransactionReceiptReportDetails(this.serviceID, 500, this.startDate, this.endDate)
      .subscribe((Response) => {       
        console.log(Response);
        if (Response.Status == 'OK') {
          this.dataSource.data = Response.Result as ITransactionReceiptResponse[];
          // Activity Log
          this.userActivityService
            .addNewActivity(
              'Transaction Receipt',
              this.activityType.NOTIFICATION,
              `Transaction receipt generated for : ${this.serviceName}.`
            )
            .subscribe((response) => {});
        } else {         
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Transaction Receipt Loading Failed';
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
    this.transactionReceiptForm.reset();
    this.myForm.resetForm();
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  // Download Statement
  generateReceipt(receiptParam: ITransactionReceiptResponse) {
    this.submitted = true;
    this.loading = true;

    this.reportName = 'Transaction Receipt : ' + this.serviceName;
    this.userTransactionDetails = receiptParam;

    this.bankAccountService
      .downloadTransactionReceipt(this.userTransactionDetails)
      .subscribe((Response) => {       
        if (Response.Status == 'OK') {
          this.onDownload(Response.Result, '1');
          // Activity Log
          this.userActivityService
            .addNewActivity(
              'Transaction Receipt',
              this.activityType.NOTIFICATION,
              `Transaction Receipt Downloaded For  ${this.serviceName}.`
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
