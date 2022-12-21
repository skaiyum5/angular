import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../../../services/bankaccount.service';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { IRequestLostCard } from '../../../models/request-lostcard.model';
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
  selector: 'app-lostcard-request',
  templateUrl: './lostcard-request.component.html',
  styleUrls: ['./lostcard-request.component.css']
})
export class LostcardRequestComponent implements OnInit {

  lostcardRequestForm: UntypedFormGroup;

  homeBankBranchList: IHomeBranchInfoResponse[];
  requestLostCard: IRequestLostCard = {};

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

    this.lostcardRequestForm = this.formBuilder.group({
      ddlBranch: new UntypedFormControl('', Validators.required),
      txtSearchValue: new UntypedFormControl(''),
      ddlCardType: new UntypedFormControl('',Validators.required),
      txtCardNo: new UntypedFormControl('', Validators.required),
      txtInstruction: new UntypedFormControl('', Validators.required)
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

  get f() {
    return this.lostcardRequestForm.controls;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.requestLostCard.BranchId = this.f.ddlBranch.value;
    this.requestLostCard.CardNo = this.f.txtCardNo.value;
    this.requestLostCard.CardType = this.f.ddlCardType.value;
    this.requestLostCard.Instruction = this.f.txtInstruction.value;

    if (this.lostcardRequestForm.valid) {
      this.requestService
        .sendLostCardRequest(this.requestLostCard)
        .subscribe((Response) => {
          if (Response.Status == 'OK') {
            this.loading = false;
            this.popupError = false;
            this.header = 'Success';
            this.message = 'Request submitted successfully';
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
    this.lostcardRequestForm.reset();
    this.f.ddlBranch.setValue('');
    this.f.ddlCardType.setValue('');
    this.f.txtCardNo.setValue('');
    this.f.txtInstruction.setValue('');
  }

}
