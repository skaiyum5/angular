import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IRtgsBankList } from '../../../models/bank_rtgsbanklist.model';
import { IRtgsBranchListResponse } from '../../../models/bank_rtgsbranchlist.model';
import { IRtgsCountryList } from '../../../models/bank_rtgscountrylist.model';
import { BankAccountService } from '../../../services/bankaccount.service';

import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { IBeneficiary } from 'src/app/models/beneficiary.model';
import { IFundTransferRTGS } from '../../../models/fundtransfer-rtgs.model'

@Component({
  selector: 'app-rtgs',
  templateUrl: './rtgs.component.html',
  styleUrls: ['./rtgs.component.css']
})
export class RtgsComponent implements OnInit {

  rtgsBankList: IRtgsBankList[];
  rtgsBranchList: IRtgsBranchListResponse[];
  rtgsCountryList: IRtgsCountryList[];

  beneficiaryList: IBeneficiary[];
  fundtransferrtgs:IFundTransferRTGS={};

  @Output() rtgsAccountDetails: EventEmitter<IFundTransferRTGS> =new EventEmitter();

  constructor(
    private bankAccountService: BankAccountService,
    private beneficiaryService: BeneficiaryService
    ) { }

  ngOnInit(): void {
    this.getRTGSBankList();
    this.getRTGSCountryList();
    this.getBeneficiaryList("RTGS");
  }

  //Rtgs Bank
  getRTGSBankList() { 
    this.bankAccountService.getRTGSBankList().subscribe(Response => {
      if (Response.Status == 'OK') {
        this.rtgsBankList = Response.Result as any[];
      }
      else {
        alert("RTGS Bank Loading Failed");
      }
    });
  }

  // Rtgs Branch
  getRTGSBranchList(event: any) { 
    this.fundtransferrtgs.bankId = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);

    this.bankAccountService.getRTGSBranchList(event.target.value).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.rtgsBranchList = Response.Result as any[];
      }
      else {
        alert("RTGS Branch Loading Failed");
      }
    });
  }

  // Rtgs Country
  getRTGSCountryList() { 
    this.bankAccountService.getRTGSCountryList().subscribe(Response => {
      if (Response.Status == 'OK') {
        this.rtgsCountryList = Response.Result as any[];
      }
      else {
        alert("RTGS Country Loading Failed");
      }
    });
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


  getSelectedRTGSBranch(event: any) {
    this.fundtransferrtgs.branchId = event.target.value;    
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }

  getRTGSAccountDetails(event: any) {
    this.fundtransferrtgs.accountNumber = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }

  getRTGSReceiverName(event: any) {
    this.fundtransferrtgs.receiverName = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }

  getRTGSAddress(event: any) {
    this.fundtransferrtgs.receiverAddress = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }

  getRTGSCityName(event: any) {
    this.fundtransferrtgs.receiverCity = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }

  getSelectedRTGSCountry(event: any) {
    this.fundtransferrtgs.receiverCountry = event.target.value;
    this.rtgsAccountDetails.emit(this.fundtransferrtgs);
  }


}
