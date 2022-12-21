import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IAccountListResponse } from '../../../models/account_list.model';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var require: any;
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css'],
})
export class AccountSummaryComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  dataSource = new MatTableDataSource<IAccountListResponse>([]);
  @ViewChild('tablePaginator') paginator: MatPaginator;

  displayedColumns: string[] = [
    'brancH_NM',
    'producT_NM',
    'accounT_TITLE',
    'availablE_BALANCE',
    'outstandinG_BAL',
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.dataSource.data = data.accountSummary.Result;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).download();
    pdfMake.createPdf(documentDefinition).open();
  }
}
