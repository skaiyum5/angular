import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IFinancialTransaction } from 'src/app/models/financial-transaction.model';

@Component({
  selector: 'app-fnc-trans-dtls',
  templateUrl: './fnc-trans-dtls.component.html',
  styleUrls: ['./fnc-trans-dtls.component.css']
})
export class FncTransDtlsComponent implements OnInit {
  @Input() financialTransactions: IFinancialTransaction[];

  dataSource = new MatTableDataSource<IFinancialTransaction>([]);
  @ViewChild('tablePaginator') paginator: MatPaginator;

  displayedColumns: string[] = [
    'sl',
    'transactioN_DATE',
    'transfeR_TYPE',
    'froM_ACCOUNT_NO',
    'tO_ACCOUNT_NO',
    'receiveR_NM',
    'amounT_CCY',
  ];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.financialTransactions;
    console.log(this.financialTransactions);
  }

  ngOnChanges() {
    this.dataSource.data = this.financialTransactions;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
