import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { delay } from 'rxjs/operators';
import {
  IUnUsedChequeDetail,
  IUnUsedChequeDetailResponse,
} from 'src/app/models/cheque_unusedchequedetail.model';
import { IRequestStopCheque } from 'src/app/models/request-stopcheque.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-unused-cheques',
  templateUrl: './unused-cheques.component.html',
  styleUrls: ['./unused-cheques.component.css'],
})
export class UnusedChequesComponent implements OnInit {
  @Input() unUsedChequeList: IUnUsedChequeDetailResponse[];
  @Input() unUsedCheque: IUnUsedChequeDetail;
  @Input() branchName: string;
  @Input() issueDate: string;
  @Input() loading: boolean;
  @Output() otpShowStatus = new EventEmitter<boolean>();
  @Output() stopChequeEmitter = new EventEmitter<IRequestStopCheque>();

  stopChequeForm: UntypedFormGroup;
  stopCheque: IRequestStopCheque = {};


  popUpInfo = {
    accountNumber: '',
    bankBranch: '',
    branchId: '',
    chequePrefix: '',
    leafNo: '',
  };

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  dataSource = new MatTableDataSource<IUnUsedChequeDetailResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('close') close: ElementRef;

  displayedColumns: string[] = ['leafno', 'status', 'button'];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private requestService: RequestService,
    private datepipe: DatePipe,
    private authenticationService: AuthenticationService
  ) {}

  get f() {
    return this.stopChequeForm.controls;
  }

  ngOnInit(): void {
    this.stopChequeForm = this.formBuilder.group({
      chequeAmount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      reason: [''],
    });
  }

  ngOnChanges() {
    this.dataSource.data = this.unUsedChequeList;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  stopChequePopUp(chequePrefix: string, leafNo: string) {
    this.popUpInfo.accountNumber = this.unUsedCheque.accountNumber;
    this.popUpInfo.bankBranch = this.branchName;
    this.popUpInfo.branchId = this.unUsedCheque.branchId;
    this.popUpInfo.chequePrefix = chequePrefix;
    this.popUpInfo.leafNo = leafNo;
  }

  stopChequeRequest() {
    this.loading = true;

    this.stopCheque.BranchId = this.unUsedCheque.branchId;
    this.stopCheque.AccountNumber = this.unUsedCheque.accountNumber;
    this.stopCheque.ChequeAmount = parseInt(this.f.chequeAmount.value);
    this.stopCheque.ChequeDate = this.formatDate(this.issueDate);
    this.stopCheque.ChequePrefix = this.popUpInfo.chequePrefix;
    this.stopCheque.StartLeafNo = parseInt(this.unUsedCheque.startLeafNo);
    this.stopCheque.EndLeafNo = parseInt(this.unUsedCheque.endLeafNo);
    this.stopCheque.StopCheckNo = parseInt(this.popUpInfo.leafNo);
    this.stopCheque.Reason = this.f.reason.value;
    this.stopCheque.Beneficiary = 'ok';
    this.stopCheque.TPIN = '';
    this.stopCheque.OTP = '';

    this.requestService
      .sendStopChequeRequest(this.stopCheque)
      .subscribe((Response) => {
        console.log(this.stopCheque);
        if (Response.Status == 'OK') {
          this.close.nativeElement.click();
          this.loading = false;
          // alert(Response.Message);
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        } else if (Response.Status === 'OTP') {
          this.close.nativeElement.click();
          this.loading = false;
          this.otpShowStatus.emit(true);
          this.stopChequeEmitter.emit(this.stopCheque);
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.close.nativeElement.click();
          this.loading = false;
          this.popupError = true;
          this.header = Response.Status;
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  formatDate(value: any): string {
    let dateFormat = value.split('/');
    let year = dateFormat[2];
    let month = dateFormat[1];
    let day = dateFormat[0];
    let date = new Date(year, month - 1, day);
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
