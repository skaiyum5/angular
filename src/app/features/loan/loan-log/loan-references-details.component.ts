import { Component, Input, OnInit } from '@angular/core';
import { ILoanReferenceResponse } from 'src/app/models/loan_applicataion_request_details.model';

@Component({
  selector: 'app-loan-references-details',
  templateUrl: './loan-references-details.component.html',
  styleUrls: ['./loan-references-details.component.css']
})
export class LoanReferencesDetailsComponent implements OnInit {
  @Input() loanReferences: ILoanReferenceResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
