import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IGetRequestWithDetails } from 'src/app/models/requestWithDetails.model';

@Component({
  selector: 'app-request-log',
  templateUrl: './request-log.component.html',
  styleUrls: ['./request-log.component.css'],
})
export class RequestLogComponent implements OnInit {
  dataSource = new MatTableDataSource<IGetRequestWithDetails>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['requestType', 'requestDate', 'status', 'details'];
  requestDetails : any;
  popup: boolean = false;  
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.dataSource.data = data.requstLog.Result;
      console.log(data.requstLog.Result);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  showRequestDetails(rowData: IGetRequestWithDetails) {
    console.log(rowData);
    this.requestDetails = rowData;
    this.popupError = false;
    this.header = 'Request Details';
    this.btnText = 'Close';
    this.popup = true;
  }

  onCloseModal(close: boolean) {    
    this.popup = close;   
  }
}
