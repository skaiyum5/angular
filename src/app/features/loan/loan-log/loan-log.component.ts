import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ILoanApplicationRequest } from 'src/app/models/loan_application_request.model';

@Component({
  selector: 'app-loan-log',
  templateUrl: './loan-log.component.html',
  styleUrls: ['./loan-log.component.css'],
})
export class LoanLogComponent implements OnInit {
  loanApplicationList: ILoanApplicationRequest[];

  dataSource = new MatTableDataSource<ILoanApplicationRequest>([]);
  @ViewChild('tablePaginator') paginator: MatPaginator;

  displayedColumns: string[] = [
    'loanrequestid',
    'userId',
    'userNm',
    'productNm',
    'branchId',
    'branchNm',
    'authStatus',
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.loanApplicationList = data.loanApplications.Result;
      this.dataSource.data = data.loanApplications.Result;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
