import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAccountListResponse } from '../../../models/account_list.model';
import { BankAccountService } from '../../../services/bankaccount.service';

@Component({
  selector: 'app-own-account',
  templateUrl: './own-account.component.html',
  styleUrls: ['./own-account.component.css']
})
export class OwnAccountComponent implements OnInit {

  userAccountList: IAccountListResponse[];
  PayeeAccountTitle: string='';
  @Output() ownSelectedAccount: EventEmitter<string> =   new EventEmitter();

  constructor(private bankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.getAccountList("0");
  }

  //Load Account List
  getAccountList(nameValueList: string) { 
    this.bankAccountService.getUserAccount(nameValueList).subscribe(Response => {
      if (Response.Status == 'OK') {
        this.userAccountList = Response.Result as any[];
      }
      else {
        alert("Receiver Account Loading Failed");
      }
    });
  }

  // Account Title
  getAccountDetails(event: any) {     
   // Account Title
    var acc = event.target.value.split('_');          
    this.ownSelectedAccount.emit(event.target.value);
    this.PayeeAccountTitle = acc[2];   
  }

}
