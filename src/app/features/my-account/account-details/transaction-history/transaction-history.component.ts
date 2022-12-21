import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ILastNumberofTransactionsResponse } from 'src/app/models/account_lastnumberoftransactions.model';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  @Input() transactionHistory: ILastNumberofTransactionsResponse[];

  dataSource = new MatTableDataSource<ILastNumberofTransactionsResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  transactionDisplayedColumns: string[] = [    
    'tranS_DATE',    
    'dR_AMOUNT',
    'cR_AMOUNT',
    'chQ_NO',
    'balance',
    'narration',
  ];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.transactionHistory;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

}
