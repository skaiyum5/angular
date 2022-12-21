import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IBulkFundTransfer } from 'src/app/models/bulk_fund_transfer.model';
import { IBulkFundTransferRequest } from 'src/app/models/bulk_fund_transfer_request.model';
import { FundTransferService } from 'src/app/services/fundtransfer.service';

@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: ['./bulk-transfer.component.css'],
})
export class BulkTransferComponent implements OnInit {
  fileUploadForm: UntypedFormGroup;
  bulkTransferList: IBulkFundTransfer[];
  selectedTransferList: IBulkFundTransfer[] = [];
  bulkTransferRequest: IBulkFundTransferRequest = {};
  bulkTransferResponse: IBulkFundTransfer[] = [];

  checked = false;
  selectAllCheck = false;

  bulkResponseComponent = false;

  loading = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  // otp
  otpComponentShow = false;
  otp = '';
  otpSubmit: Function;
  goBack: Function;

  // bulk response
  responseGoBack: Function;

  transferDisplayedColumns: string[] = [
    'select',
    'serial',
    'fromAccount',
    'toAccount',
    'amounT_LCY',
    'amounT_CCY',
    'narration',
    'purposE_OF_TRANSACTION',
    'transfeR_TYPE',
    'banK_ID',
    'receiveR_ID',
    'receiveR_NM',
    'rtgS_ADDRESS',
    'rtgS_CITY',
    'rtgS_COUNTRY',
    'status',
    'transactioN_ID',
    'errormsg',
  ];

  dataSource = new MatTableDataSource<IBulkFundTransfer>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private fundTransferService: FundTransferService
  ) {}

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      fileSource: ['', Validators.required],
    });

    this.otpSubmit = this.onOtpSubmit.bind(this);
    this.goBack = this.backClick.bind(this);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  get f() {
    return this.fileUploadForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileUploadForm.patchValue({
        fileSource: file,
      });
    }
  }

  onSubmit() {
    this.loading = true;

    const formData = new FormData();
    formData.append(
      'file',
      this.fileUploadForm.get('fileSource').value,
      this.fileUploadForm.get('fileSource').value.name
    );

    this.fundTransferService
      .saveExcelForBulkFundTransfer(formData)
      .subscribe((response) => {
        this.loading = false;
        if (response.Status === 'OK') {
          this.bulkTransferList = response.Result;
          this.dataSource.data = response.Result as IBulkFundTransfer[];
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  selectTransfers(event: any, element: IBulkFundTransfer) {
    if (event.target.checked) {
      if (this.selectedTransferList.indexOf(element) === -1) {
        this.selectedTransferList.push(element);
      }
    } else {
      this.selectedTransferList = this.selectedTransferList.filter(
        (t) => t.sl !== element.sl
      );
    }

    if (this.bulkTransferList.length === this.selectedTransferList.length) {
      this.selectAllCheck = true;
    } else {
      this.selectAllCheck = false;
    }
  }

  selectAllTransfers(event: any) {
    if (event.target.checked) {
      this.selectAllCheck = true;
      this.checked = true;
      this.selectedTransferList = this.bulkTransferList;
    } else {
      this.selectAllCheck = false;
      this.checked = false;
      this.selectedTransferList = [];
    }
  }

  submitTable() {
    this.loading = true;
    this.bulkTransferRequest.ftLogs = this.selectedTransferList;
    this.bulkTransferRequest.TPIN = '';
    this.bulkTransferRequest.OTP = '';

    this.fundTransferService
      .saveBulkFundTransfer(this.bulkTransferRequest)
      .subscribe((response) => {
        this.loading = false;
        if (response.Status === 'OTP') {
          this.otpComponentShow = true;
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  onOtpSubmit() {
    this.loading = true;
    this.bulkTransferRequest.ftLogs = this.selectedTransferList;
    this.bulkTransferRequest.TPIN = '';
    this.bulkTransferRequest.OTP = this.otp;

    this.fundTransferService
      .saveBulkFundTransfer(this.bulkTransferRequest)
      .subscribe((response) => {
        this.loading = false;
        if (response.Status === 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;

          this.bulkTransferResponse = response.Result;

          this.otpComponentShow = false;
          this.bulkResponseComponent = true;

          this.bulkTransferList = null;
          this.selectedTransferList = [];
          this.bulkTransferRequest = {};
          this.dataSource.data = [];

          this.checked = false;
          this.selectAllCheck = false;
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  setOtp(otp: string) {
    this.otp = otp;
  }

  backClick() {
    this.otpComponentShow = false;
    this.bulkResponseComponent = false;
  }
}
