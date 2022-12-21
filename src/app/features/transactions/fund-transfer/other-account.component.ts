import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IHomeBranchInfoResponse } from '../../../models/bank_homebankbranchinfo.model';
import { BankAccountService } from '../../../services/bankaccount.service';

@Component({
  selector: 'app-other-account',
  templateUrl: './other-account.component.html',
  styleUrls: ['./other-account.component.css']
})
export class OtherAccountComponent implements OnInit {

  homeBankBranchList: IHomeBranchInfoResponse[];
  branchId:string='';
  accountNumber:string='';
  OtherAccountTitle:string = '';
  cbsAccInfo:string='';
  @Output() otherSelectedAccount: EventEmitter<string> =new EventEmitter();

  constructor(private bankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.getHomeBankBranchList("0");
  }

  getHomeBankBranchList(value: string) { 
    this.bankAccountService.getHomeBankBranchList(value).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.homeBankBranchList = Response.Result as any[];
      }
      else {
        alert("Branch Loading Failed");
      }
    });
  }

  getBranchInfo(event:any)
  {
    this.branchId = event.target.value
  }

  getAccountDetails(event:any) { 
    this.bankAccountService.getCbsAccInfo(this.branchId, event.target.value).subscribe(Response => {
     
      if (Response.Status == 'OK') {
        this.cbsAccInfo = Response.Result;
        this.OtherAccountTitle = this.cbsAccInfo.split(":")[0];    
        this.otherSelectedAccount.emit(this.branchId + "_" + event.target.value.toString() + "_" + this.OtherAccountTitle);     
      }
      else {
        alert("CBS Account Details Loading Failed");
      }
    });   
   }

}
