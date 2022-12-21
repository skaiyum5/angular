import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoanApplicationRequestDetails } from 'src/app/models/loan_applicataion_request_details.model';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  loanApplicationDetails: ILoanApplicationRequestDetails;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.loanApplicationDetails = data.loanDetails.Result;
      console.log(this.loanApplicationDetails)
    })
  }

}
