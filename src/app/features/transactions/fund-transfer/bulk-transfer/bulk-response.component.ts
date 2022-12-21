import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IBulkFundTransfer } from 'src/app/models/bulk_fund_transfer.model';

@Component({
  selector: 'app-bulk-response',
  templateUrl: './bulk-response.component.html',
  styleUrls: ['./bulk-response.component.css'],
})
export class BulkResponseComponent implements OnInit {
  @Input() bulkTransferResponse: IBulkFundTransfer[];
  @Input() goBack: Function;

  transferDisplayedColumns: string[] = [
    'serial',
    'fromAccount',
    'toAccount',
    'amounT_LCY',
    'amounT_CCY',
    'narration',
    'purposE_OF_TRANSACTION',
    'transfeR_TYPE',
    'banK_ID',
    'receiveR_ID',
    'receiveR_NM',
    'rtgS_ADDRESS',
    'rtgS_CITY',
    'rtgS_COUNTRY',
    'status',
    'transactioN_ID',
    'errormsg',
  ];

  dataSource = new MatTableDataSource<IBulkFundTransfer>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit(): void {
    this.dataSource.data = this.bulkTransferResponse;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  clickGoBack() {
    this.goBack();
  }
}
