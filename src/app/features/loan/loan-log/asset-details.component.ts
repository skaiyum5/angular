import { Component, Input, OnInit } from '@angular/core';
import { ILoanAssetResponse } from 'src/app/models/loan_applicataion_request_details.model';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css'],
})
export class AssetDetailsComponent implements OnInit {
  @Input() loanAssets: ILoanAssetResponse[];

  constructor() {}

  ngOnInit(): void {}
}
