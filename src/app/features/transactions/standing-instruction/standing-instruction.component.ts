import { Component, OnInit, ViewChild } from '@angular/core';
// import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// import { CustomDateParserFormatter } from 'src/app/helpers/custom-date-parser-formatter.service';
import { IAccountListResponse } from 'src/app/models/account_list.model';

import { INewInstruction } from 'src/app/models/instruction_newinstruction.model';
import {
  InstructionBeneficiary,
  IGetInstructionResponse,
} from 'src/app/models/instruction_getinstruction.model';
import { IGetBeneficiaryResponse } from 'src/app/models/instruction_getbeneficiary.model';

import { StandingInstructionService } from 'src/app/services/standinginstruction.service';
import { BankAccountService } from 'src/app/services/bankaccount.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { AccountType } from 'src/app/models/app_enum.model';


@Component({
  selector: 'app-standing-instruction',
  templateUrl: './standing-instruction.component.html',
  styleUrls: ['./standing-instruction.component.css'],
})
export class StandingInstructionComponent implements OnInit {
  userAccountList: IAccountListResponse[];
  instructionList: IGetInstructionResponse[];
  beneficiaryList: IGetBeneficiaryResponse[];
  instructionRequest: INewInstruction = {};

  isInstructionListShow = true;
  isInstructionInputShow = false;

  standingInstructionForm: UntypedFormGroup;
  submitted = false;

  instruction_rule_no: string = '';

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private bankAccountService: BankAccountService,
    private instructionService: StandingInstructionService,
    private loginUser: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.getInstruction(this.loginUser.currentUserValue.branchId);

    this.standingInstructionForm = new UntypedFormGroup({
      ddlPayeeAccount: new UntypedFormControl('', Validators.required),
      txtSearchPayeeAccount: new UntypedFormControl(''),
      ddlBeneficiaryAccount: new UntypedFormControl('', Validators.required),
      txtSearchBeneficiaryAccount: new UntypedFormControl(''),
      ddlPriority: new UntypedFormControl('1', Validators.required),
    });
  }

  getAccountList(nameValueList: string) {
    this.bankAccountService
      .getUserAccount(nameValueList)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.userAccountList = Response.Result as any[];
        } else {
          // alert('Account Loading Failed');
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Account Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
      });
  }

  getInstruction(branchId: string) {
    this.instructionService.getInstructions(branchId).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.instructionList = Response.Result as IGetInstructionResponse[];
      } else {
        // alert('Standing Instruction Loading Failed');
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Standing Instruction Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getInstructionBeneficiary(branchId: string) {
    this.instructionService.getBeneficiary(branchId).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.beneficiaryList = Response.Result as IGetBeneficiaryResponse[];

        //   if (this.beneficiaryList == null || this.beneficiaryList.length == 0) {
        //     this.popupError = true;
        //     this.header = '';
        //     this.message = 'Please Add Your Beneficiary First';
        //     this.btnText = 'Close';
        //     this.popup = true;
        // }
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Beneficiary Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getFrequencyTitle(termFreq: string) {
    if (termFreq == 'D') {
      return 'Daily';
    } else if (termFreq == 'W') {
      return 'Weekly';
    } else if (termFreq == 'F') {
      return 'Fortnightly';
    } else if (termFreq == 'M') {
      return 'Monthly';
    } else if (termFreq == 'Q') {
      return 'Quarterly';
    } else if (termFreq == 'H') {
      return 'Half-Yearly';
    } else if (termFreq == 'Y') {
      return 'Yearly';
    } else {
      return 'N/A';
    }
  }

  getStatusTitle(status: string) {
    if (status == 'I') {
      return 'Inactive';
    } else if (status == 'A') {
      return 'Active';
    } else {
      return 'N/A';
    }
  }

  addInstruction() {
    this.getAccountList(AccountType.FundTransfer.toString());
    this.getInstructionBeneficiary(this.loginUser.currentUserValue.branchId);
    this.isInstructionListShow = !this.isInstructionListShow;
    this.isInstructionInputShow = !this.isInstructionListShow;
  }

  goBackToList() {
    this.isInstructionListShow = true;
    this.isInstructionInputShow = false;
    this.resetInput();
  }

  getBeneficiaryDetails(event: any) {
    document.getElementById('lblTermFrequency').innerHTML =
      this.getFrequencyTitle(event.value.split('_')[2]);
    document.getElementById('lblTotalTerm').innerHTML =
      event.value.split('_')[3];
    document.getElementById('lblTermPaid').innerHTML =
      event.value.split('_')[4];
    document.getElementById('lblInstallmentAmount').innerHTML =
      event.value.split('_')[5];
    document.getElementById('lblTotalInstallmentAmount').innerHTML =
      event.value.split('_')[6];
    document.getElementById('lblPaidInstallmentAmount').innerHTML =
      event.value.split('_')[7];
    this.instruction_rule_no = event.value.split('_')[8];
  }

  get f() {
    return this.standingInstructionForm.controls;
  }

  createNewInstruction() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.standingInstructionForm.invalid) {
      return;
    }

    this.instructionRequest.branch_id =
      this.loginUser.currentUserValue.branchId;
    this.instructionRequest.inst_sl_no = '';
    this.instructionRequest.paye_cust_type = '';
    this.instructionRequest.paye_cust_grp_id =
      this.loginUser.currentUserValue.customerId;
    this.instructionRequest.paye_br_id =
      this.f.ddlPayeeAccount.value.split('_')[0];
    this.instructionRequest.paye_acc_no =
      this.f.ddlPayeeAccount.value.split('_')[1];
    this.instructionRequest.mail_addrs = '';
    this.instructionRequest.benf_type = '';
    this.instructionRequest.inst_status = '';
    this.instructionRequest.make_by = this.loginUser.currentUserValue.userName;
    this.instructionRequest.inst_rule_id = this.instruction_rule_no;
    this.instructionRequest.benf_cust_grp_id = '';
    this.instructionRequest.benf_prio_no = this.f.ddlPriority.value;
    this.instructionRequest.benf_acc_no =
      this.f.ddlBeneficiaryAccount.value.split('_')[1];
    this.instructionRequest.benf_br_id =
      this.f.ddlBeneficiaryAccount.value.split('_')[0];
    this.instructionRequest.trm_tot_no =
      document.getElementById('lblTotalTerm').innerHTML;
    this.instructionRequest.trm_freq =
      this.f.ddlBeneficiaryAccount.value.split('_')[2];
    this.instructionRequest.trm_instl_amt = document.getElementById(
      'lblInstallmentAmount'
    ).innerHTML;
    this.instructionRequest.trm_tot_amt = document.getElementById(
      'lblTotalInstallmentAmount'
    ).innerHTML;
    this.instructionRequest.trm_tot_on =
      document.getElementById('lblTermPaid').innerHTML;

    console.log(this.instructionRequest);

    this.instructionService
      .createNewStandingInstruction(this.instructionRequest)
      .subscribe((Response) => {
        this.submitted = false;
        console.log(this.instructionRequest);
        console.log(Response);
        if (Response.Status == 'OK') {  
          this.showPopup(true, Response.Message, 'Success', 'Close'); 
          this.resetInput();
        } else { 
          this.showPopup(false, Response.Message, 'Failure', 'Close');          
        }
      });
  }

  resetInput() {
    document.getElementById('lblTermFrequency').innerHTML = '';
    document.getElementById('lblTotalTerm').innerHTML = '';
    document.getElementById('lblTermPaid').innerHTML = '';
    document.getElementById('lblInstallmentAmount').innerHTML = '';
    document.getElementById('lblTotalInstallmentAmount').innerHTML = '';
    document.getElementById('lblPaidInstallmentAmount').innerHTML = '';

    this.standingInstructionForm.reset();
    this.standingInstructionForm.patchValue({ ddlPayeeAccount: '' });
    this.standingInstructionForm.patchValue({ ddlBeneficiaryAccount: '' });
    this.standingInstructionForm.patchValue({ ddlPriority: '1' });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  showPopup(isSuccess: boolean, message: string, header: string, buttonText: string) {
    if (isSuccess == true) {
      this.popupError = false;
    } else if (isSuccess == false) {
      this.popupError = true;
    }

    this.btnText = buttonText;
    this.header = header;
    this.message = message;
    this.popup = true;
  }
}
