import { Component, OnInit, ViewChild } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { RequestService } from '../../../services/request.service';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { IRequestStatement } from 'src/app/models/request-statement.model';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-statement-request',
  templateUrl: './statement-request.component.html',
  styleUrls: ['./statement-request.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class StatementRequestComponent implements OnInit {
  @ViewChild('myForm') myForm: NgForm;
  today = this.calendar.getToday();
  stamentReq: IRequestStatement = {};
  statementRequestForm: UntypedFormGroup;
  submitted = false;
  loading = false;
  userAccountList: IAccountListResponse[];
  branchId: string;
  accountNumber: string;
  startDate: any;
  endDate: any;
  minDate = { year: this.today.year - 30, month: 1, day: 1 };
  maxDate = { year: this.today.year + 30, month: 12, day: 31 };

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private requestService: RequestService,
    private datepipe: DatePipe,
    private loginUser: AuthenticationService,
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.statementRequestForm = this.formBuilder.group({
      ddlAccountNumber: ['', Validators.required],
      txtSearchValue: [''],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
    });
  }

  get f() {
    return this.statementRequestForm.controls;
  }

  getAccountAndBranch(event: any) {
    var acc = event.value.split('-');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
  }

  createStatementRequest() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.statementRequestForm.invalid) {
      return;
    }

    this.stamentReq.BranchId = this.branchId;
    this.stamentReq.AccountNumber = this.accountNumber;
    this.stamentReq.DateFrom = this.formatDate(this.f.startdate.value);
    this.stamentReq.DateTo = this.formatDate(this.f.enddate.value);
    this.stamentReq.CustomerId = this.loginUser.currentUserValue.customerId;

    this.requestService
      .sendStatementRequest(this.stamentReq)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          // alert(Response.Message);
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Ok';
          this.popup = true;
        } else if (Response.Status === 'UNAUTH') {
          this.loginUser.logout();
        } else {
          // alert(Response.Message);
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

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
