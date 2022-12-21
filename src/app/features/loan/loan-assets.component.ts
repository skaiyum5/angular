import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ILoanAssets } from 'src/app/models/loan_assets.model';

@Component({
  selector: 'app-loan-assets',
  templateUrl: './loan-assets.component.html',
  styleUrls: ['./loan-assets.component.css'],
})
export class LoanAssetsComponent implements OnInit {
  assetForm: UntypedFormGroup;
  loanAsset: ILoanAssets;
  @Input() loanAssetList: ILoanAssets[] = [];
  @Input() success: boolean;
  @Output() assetsEmitter = new EventEmitter<ILoanAssets[]>();
  @Output() showAssetsEmitter = new EventEmitter<boolean>();

  // ux
  btnVisible = true;

  dataSource = new MatTableDataSource<ILoanAssets>([]);

  displayedColumns: string[] = [
    'details',
    'marketValue',
    'location',
    'liabilities',
    'encumbered',
    'action',
  ];

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.dataSource.data = this.loanAssetList;

    this.assetForm = this.formBuilder.group({
      details: ['', Validators.required],
      marketValue: ['', Validators.required],
      location: ['', Validators.required],
      liabilities: ['', Validators.required],
      encumbered: [true],
    });
  }

  ngOnChanges() {
    if (this.success) {
      this.assetForm.reset();
      this.loanAsset = null;
      this.loanAssetList = [];
      this.f.encumbered.setValue(true);
      this.btnVisible = true;
    }
  }

  get f() {
    return this.assetForm.controls;
  }

  onSubmit() {
    this.loanAsset = {
      AssetDetails: this.f.details.value,
      PresentMarketValue: this.f.marketValue.value,
      LocationDescription: this.f.location.value,
      Liabilities: this.f.liabilities.value,
      EncumberedUnencumbered: this.f.encumbered.value,
    };
    this.loanAssetList.push(this.loanAsset);
    this.dataSource.data = this.loanAssetList;
    this.assetForm.reset();
    this.f.encumbered.setValue(true);
  }

  onDelete(element: any) {
    this.loanAssetList = this.loanAssetList.filter(
      (loanAsset) => loanAsset !== element
    );
    this.dataSource.data = this.loanAssetList;
  }

  onNext() {
    this.assetsEmitter.emit(this.loanAssetList);
    // this.btnVisible = false;
  }

  onBack() {
    this.showAssetsEmitter.emit(false);
  }
}
