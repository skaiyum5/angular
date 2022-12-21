import { Component, OnInit } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { ICertificateDocType, IRequestPaperCertificate } from '../../../models/request-papercertificate.model';
import { RequestService } from '../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-papercertificate-request',
  templateUrl: './papercertificate-request.component.html',
  styleUrls: ['./papercertificate-request.component.css']
})
export class PapercertificateRequestComponent implements OnInit {

  certificateRequestForm: UntypedFormGroup;

  certificateTypeList: ICertificateDocType[];
  requestCertificate: IRequestPaperCertificate = {};
  userAccountList: IAccountListResponse[];

  branchId: string;
  accountNumber: string;
  PayOrderAmountInWords: string;

  submitted = false;
  loading = false;

  // popup property
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  popup: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private requestService: RequestService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.data.subscribe((data) => {
      this.userAccountList = data.accountSummary.Result;
    });

    this.getCertificateType();

    this.certificateRequestForm = this.formBuilder.group({
      ddlAccountNumber: ['', Validators.required],
      txtSearchValue: [''],
      ddlCertificateType: ['', Validators.required],
      txtSearchCertificateValue: [''],
      txtPurpose: ['', Validators.required],
      txtReferenceNo: ['', Validators.required],
    });
  }

  get f() {
    return this.certificateRequestForm.controls;
  }

  getAccountAndBranch(event: any) {
    var acc = event.value.split('-');
    this.branchId = acc[0];
    this.accountNumber = acc[1];
  }

  getCertificateType() {
    this.requestService.getPaperCertificateDocType().subscribe((Response) => {
      console.log(Response);
      if (Response.Status == 'OK') {
        this.certificateTypeList = Response.Result as ICertificateDocType[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Certificate Type Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.requestCertificate.Branchid = this.branchId;
    this.requestCertificate.Accountnumber = this.accountNumber;
    this.requestCertificate.Certificatetype = this.f.ddlCertificateType.value;
    this.requestCertificate.Purpose = this.f.txtPurpose.value;
    this.requestCertificate.RefaranceNo = this.f.txtReferenceNo.value;

    if (this.certificateRequestForm.valid) {
      this.requestService
        .sendPaperCertificateRequest(this.requestCertificate)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loading = false;
            this.popupError = false;
            this.header = 'Success';
            this.message = 'Paper certificate request submitted successfully';
            this.btnText = 'OK';
            this.popup = true;

            this.onReset();
          } else {
            this.loading = false;
            this.popupError = true;
            this.header = 'Failure';
            this.message = Response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
          this.loading = false;
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.certificateRequestForm.reset();
    this.f.ddlAccountNumber.setValue('');
    this.f.ddlCertificateType.setValue('');
    this.f.txtPurpose.setValue('');
    this.f.txtReferenceNo.setValue('');
  }

}
