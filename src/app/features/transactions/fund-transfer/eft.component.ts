import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IBankInfoResponse } from '../../../models/bank_bankinfo.model';
import { IBankBranchInfoResponse } from '../../../models/bank_otherbankbranchinfo.model';
import { BankAccountService } from '../../../services/bankaccount.service';

import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { IBeneficiary } from 'src/app/models/beneficiary.model';
import { IFundTransferEFT } from '../../../models/fundtransfer-eft.model'

@Component({
  selector: 'app-eft',
  templateUrl: './eft.component.html',
  styleUrls: ['./eft.component.css']
})
export class EftComponent implements OnInit {
  eftForm: UntypedFormGroup;
  otherBankList: IBankInfoResponse[];
  otherBankBranchList: IBankBranchInfoResponse[];
  beneficiaryList: IBeneficiary[];
  fundtransfereft:IFundTransferEFT={};

  // bankId:string;
  // branchId:string;
  // accountNumber:string;
  // accountTitle:string;
  @Output() eftAccountDetails: EventEmitter<IFundTransferEFT> =new EventEmitter();
  
  constructor
  (
    private bankAccountService: BankAccountService,
    private beneficiaryService: BeneficiaryService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.eftForm = this.formBuilder.group({     
      txtSearchEFTBank: [''],
      txtSearchEFTBranch: [''],
    });

    this.getOtherBankList("1");
    this.getBeneficiaryList("EFT");
  }

  //Other Bank
  getOtherBankList(value: string) { 
    this.bankAccountService.getBankList(value).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.otherBankList = Response.Result as any[];
      }
      else {
        alert("Bank Loading Failed");
      }
    });
  }

  // Other Bank Branch
  getOtherBankBranchList(event: any) { 
    this.fundtransfereft.bankId = event.value;
    this.eftAccountDetails.emit(this.fundtransfereft);

    this.bankAccountService.getOtherBankBranchList("0", event.value).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.otherBankBranchList = Response.Result as any[];        
      }
      else {
        alert("Branch Loading Failed");
      }
    });
  }

  getOtherBankBranchDetails(event:any)
  {    
    this.fundtransfereft.branchId = event.value;
    this.eftAccountDetails.emit(this.fundtransfereft);
  }

  getAccountNumber(event:any)
  {
    this.fundtransfereft.accountNumber = event.target.value;
    this.eftAccountDetails.emit(this.fundtransfereft);
  }
  
  getReceiverName(event:any)
  {
    this.fundtransfereft.receiverName = event.target.value;
    this.eftAccountDetails.emit(this.fundtransfereft);
  }

  getReceiverID(event:any)
  {
    this.fundtransfereft.receiverId = event.target.value;
    this.eftAccountDetails.emit(this.fundtransfereft);
  }

  // Beneficiary List
  getBeneficiaryList(benficiaryType: string) { 
    this.beneficiaryService.getBeneficiary(benficiaryType).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.beneficiaryList = Response.Result as any[];
      }
      else {
        alert("Beneficiary List Loading Failed");
      }
    });
  }

  get f() {
    return this.eftForm.controls;
  }


}
