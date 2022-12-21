import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { INPSBBankList } from '../../../models/bank_npsbbanklist.model';
import { BankAccountService } from '../../../services/bankaccount.service';

import { IFundTransferNPSB } from '../../../models/fundtransfer-npsb.model'

@Component({
  selector: 'app-npsb',
  templateUrl: './npsb.component.html',
  styleUrls: ['./npsb.component.css']
})
export class NpsbComponent implements OnInit {

  npsbBankList: INPSBBankList[];
  fundtransfernpsb:IFundTransferNPSB={};

  @Output() npsbAccountDetails: EventEmitter<IFundTransferNPSB> =new EventEmitter();

  constructor(private bankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.getNPSBBankList();
  }

  //NPSB Bank
  getNPSBBankList() { 
    this.bankAccountService.getNPSBBankList().subscribe(Response => {
      if (Response.Status == 'OK') {
        this.npsbBankList = Response.Result as any[];
      }
      else {
        alert("NPSB Bank Loading Failed");
      }
    });
  }

  getSelectedReceiverType(event: any) {
    this.fundtransfernpsb.receiverType = event.target.value;    
    this.npsbAccountDetails.emit(this.fundtransfernpsb);
  }
  getSelectedBank(event: any) {
    this.fundtransfernpsb.bankId = event.target.value;    
    this.npsbAccountDetails.emit(this.fundtransfernpsb);
  }
  getSelectedAccount(event: any) {
    this.fundtransfernpsb.accountNumber = event.target.value;    
    this.npsbAccountDetails.emit(this.fundtransfernpsb);
  }
  getSelectedReceiverName(event: any) {
    this.fundtransfernpsb.receiverName = event.target.value;    
    this.npsbAccountDetails.emit(this.fundtransfernpsb);
  }

}
