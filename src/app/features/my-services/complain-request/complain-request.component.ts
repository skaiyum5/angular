import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../../../services/bankaccount.service';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { IRequestComplainSubject, IRequestComplain } from '../../../models/request-complain.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { RequestService } from '../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';


@Component({
  selector: 'app-complain-request',
  templateUrl: './complain-request.component.html',
  styleUrls: ['./complain-request.component.css']
})
export class ComplainRequestComponent implements OnInit {

  complainRequestForm: UntypedFormGroup;

  homeBankBranchList: IHomeBranchInfoResponse[];
  subjectList: IRequestComplainSubject[];
  requestComplain: IRequestComplain = {};

  submitted = false;
  loading = false;
  
  // popup property
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';
  popup: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private requestService: RequestService,
    private loginUser: AuthenticationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.getBranchList();
    this.getComplainSubjectList();

    this.complainRequestForm = this.formBuilder.group({
      ddlBranch: new UntypedFormControl('', Validators.required),
      txtSearchValue: new UntypedFormControl(''),
      ddlSubject: new UntypedFormControl('', Validators.required),
      txtDetails: new UntypedFormControl('', Validators.required)
    });
  }


  getBranchList() {
    this.bankAccountService.getHomeBankBranchList('0').subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.homeBankBranchList = Response.Result as IHomeBranchInfoResponse[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Branch Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getComplainSubjectList() {
    this.requestService.getComplainSubject().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.subjectList = Response.Result as IRequestComplainSubject[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = Response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  get f() {
    return this.complainRequestForm.controls;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.requestComplain.BranchId = this.f.ddlBranch.value;
    this.requestComplain.Subject = this.f.ddlSubject.value;
    this.requestComplain.Description = this.f.txtDetails.value;

    if (this.complainRequestForm.valid) {
      this.requestService
        .sendComplainRequest(this.requestComplain)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loading = false;
            this.popupError = false;
            this.header = 'Success';
            this.message = 'Complain submitted successfully';
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
    this.complainRequestForm.reset();
    this.f.ddlBranch.setValue('');
    this.f.ddlSubject.setValue('');
    this.f.txtDetails.setValue('');
  }
}
