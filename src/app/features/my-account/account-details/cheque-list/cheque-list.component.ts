import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IChequeBookListResponse } from 'src/app/models/cheque_chequebooklist.model';

@Component({
  selector: 'app-cheque-list',
  templateUrl: './cheque-list.component.html',
  styleUrls: ['./cheque-list.component.css'],
})
export class ChequeListComponent implements OnInit {
  @Input() chequeList: IChequeBookListResponse[];

  dataSource = new MatTableDataSource<IChequeBookListResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  chequeDisplayedColumns: string[] = [
    'chQ_PREFIX',
    'starT_LEAF_NO',
    'enD_LEAF_NO',
    'totaL_LEAVES_NO',
    'issuE_DATE',
  ];

  constructor() {}

  ngOnInit(): void {
    this.dataSource.data = this.chequeList;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
