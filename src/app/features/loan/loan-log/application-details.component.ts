import { Component, Input, OnInit } from '@angular/core';
import { ILoanApplicationRequest } from 'src/app/models/loan_application_request.model';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {
  @Input() loanApplicationDetail: ILoanApplicationRequest;

  constructor() { }

  ngOnInit(): void {
  }

}
