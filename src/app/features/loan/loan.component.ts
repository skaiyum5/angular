import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IHomeBranchInfoResponse } from 'src/app/models/bank_homebankbranchinfo.model';
import { ILoanApplication } from 'src/app/models/loan_application.model';
import { ILoanAssets } from 'src/app/models/loan_assets.model';
import { ILoanProduct } from 'src/app/models/loan_product.model';
import { ILoanProductDocument } from 'src/app/models/loan_product_document.model';
import { ILoanReference } from 'src/app/models/loan_references.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoanService } from 'src/app/services/loan.service';
import { MatTableDataSource } from '@angular/material/table';
import * as converter from 'number-to-words';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent implements OnInit {
  @ViewChild('file') file: ElementRef;

  loanForm: UntypedFormGroup;
  homeBranchList: IHomeBranchInfoResponse[];
  loanProductList: ILoanProduct[];
  selectedProduct: ILoanProduct;
  loanAssetList: ILoanAssets[] = [];
  loanReferenceList: ILoanReference[] = [];
  productDocumentList: ILoanProductDocument[] = [];
  loanApplication: ILoanApplication;

  LoanAmountInWords: string = '';
  // Loan Asset
  assetForm: UntypedFormGroup;
  loanAsset: ILoanAssets;  
  assetDataSource = new MatTableDataSource<ILoanAssets>([]);

  assetDisplayedColumns: string[] = [
    'details',
    'marketValue',
    'location',
    'liabilities',
    'encumbered',
    'action',
  ];

  // Loan Reference
  referenceForm: UntypedFormGroup;
  loanReference: ILoanReference;
  referenceDataSource = new MatTableDataSource<ILoanReference>([]);

  referenceDisplayedColumns: string[] = [
    'name',
    'relation',
    'profession',
    'eduQualification',
    'email',
    'mobile',
    'action',
  ];

  currentDocumentIndex = 0;
  uploadedDocs: { doc_id: string; doc_name: string; doc: File }[] = [];
  documentList: { DocumentId: string; DocumentNM: string }[] = [];
  docResponse: { doc_name: string; fileName: string; status: string }[] = [];

  // ux
  showLoanInfoForm = true;
  showAssetForm = true;
  mandatoryFiles = false;
  showReferenceForm = true;
  showFileUploadForm = false;

  isDisplayTenureMinMax: boolean = false;
  isDisplayAmountMinMax: boolean = false;

  submitted = false;
  loader = false;
  loanAppSuccess = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private loanService: LoanService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.homeBranchList = data.homeBranchList.Result;
    });

    this.loanForm = this.formBuilder.group({
      branch: [''],
      txtSearchValue: [''],
      product: [''],
      tenure: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      amount: [
        '',
        [Validators.required, Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],
      ],
    });

    // Asset
    this.assetDataSource.data = this.loanAssetList;
    this.assetForm = this.formBuilder.group({
      txtAssetDetails: ['', Validators.required],
      txtPresentMarketValue: ['', Validators.required],
      txtLocation: ['', Validators.required],
      txtLiabilities: ['', Validators.required],
      chkEncumbered: [true],
    });

    // Reference
    this.referenceDataSource.data = this.loanReferenceList;
    this.referenceForm = this.formBuilder.group({
      txtReferenceName: ['', Validators.required],
      txtReferenceRelation: ['', Validators.required],
      txtProfession: ['', Validators.required],
      txtEducation: ['', Validators.required],
      txtMobileNo: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(11)]],         
      txtEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }

  get f() {
    return this.loanForm.controls;
  }

  getLoanProductsList() {
    this.loanAppSuccess = false;
    this.loader = true;
    this.loanService
      .getLoanProductsList(this.f.branch.value)
      .subscribe((res) => {        
        if (res.Status === 'OK') {
          this.loanProductList = res.Result;
        } else if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'Product List Loading Failed';
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loader = false;
      });
  }

  getLoanProductDocumentList() {
    this.isDisplayTenureMinMax = false;
    this.isDisplayAmountMinMax = false;    
    this.showFileUploadForm = false;

    this.selectedProduct = this.loanProductList.filter(
      (product) => product.product_id === this.f.product.value
    )[0];

    if(this.selectedProduct.term_period_max > 0)
      this.isDisplayTenureMinMax = true;

    if(this.selectedProduct.limit_maximum > 0)
      this.isDisplayAmountMinMax = true;


    this.loader = true;
    this.loanService
      .getLoanProductDocumentList(this.f.product.value, this.f.branch.value)
      .subscribe((res) => {        
        if (res.Status === 'OK') {
          this.productDocumentList = res.Result;
          this.currentDocumentIndex = 0;

          if(this.productDocumentList.length > 0)
          {
            this.showFileUploadForm = true;
          }
          
        } else if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = res.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loader = false;
      });
  }

  onFileChange(event: any) {
    if (event.target.files?.length > 0) {
      const file: File = event.target.files[0];
      let doc = {
        doc_id: this.productDocumentList[this.currentDocumentIndex].doc_id,
        doc_name: this.productDocumentList[this.currentDocumentIndex].doc_name,
        doc: file,
      };
      if (this.uploadedDocs.some((d) => d.doc_id === doc.doc_id)) {
        this.uploadedDocs = this.uploadedDocs.filter(
          (d) => d.doc_id !== doc.doc_id
        );
      }
      this.uploadedDocs.push(doc);
      console.log(this.uploadedDocs);
      if (this.documentList.some((d) => d.DocumentId === doc.doc_id)) {
        this.documentList = this.documentList.filter(
          (d) => d.DocumentId !== doc.doc_id
        );
      }
      this.documentList.push({
        DocumentId: doc.doc_id,
        DocumentNM: doc.doc_name,
      });
      this.mandatoryFileUploaded();
    }
  }

  currDoc() {
    return this.uploadedDocs.filter(
      (doc) =>
        doc.doc_id ===
        this.productDocumentList[this.currentDocumentIndex].doc_id
    )[0];
  }

  selectIndex(index: number) {
    this.currentDocumentIndex = index;
    this.file.nativeElement.value = '';
    this.file.nativeElement.click();
  }

  fileAttached(doc_id: string) {
    return this.uploadedDocs.some((doc) => doc.doc_id === doc_id);
  }

  mandatoryFileUploaded() {
    this.mandatoryFiles = true;
    this.productDocumentList.forEach((document) => {
      if (document.doc_option === 'M') {
        let exists = this.uploadedDocs.some(
          (doc) => doc.doc_id === document.doc_id
        );
        if (!exists) {
          this.mandatoryFiles = false;
        }
      }
    });
  }

  checkTenureValidation() {
    if (this.selectedProduct) {
      if (
        this.selectedProduct.term_period_min === 0 &&
        this.selectedProduct.term_period_max === 0
      ) {
        return;
      }
      if (
        parseInt(this.f.tenure.value) < this.selectedProduct.term_period_min ||
        parseInt(this.f.tenure.value) > this.selectedProduct.term_period_max
      ) {
        this.f.tenure.setErrors({
          minMax: true,
        });
      }
    }
  }

  checkAmountValidation() {
    if (this.selectedProduct) {
      if (
        this.selectedProduct.limit_minimum === 0 &&
        this.selectedProduct.limit_maximum === 0
      ) {
        return;
      }
      if (
        parseInt(this.f.amount.value) < this.selectedProduct.limit_minimum ||
        parseInt(this.f.amount.value) > this.selectedProduct.limit_maximum
      ) {
        this.f.amount.setErrors({
          minMax: true,
        });
      }
    }
  }

  getLoanAmountInWords(event: any) {    
    if (event.target.value == '') {
      this.LoanAmountInWords = '';
    } else {
      this.LoanAmountInWords = converter.toWords(event.target.value);
      console.log(this.LoanAmountInWords);
    }
  }

  onLoanFormShow() {
    this.showLoanInfoForm = true;
    this.showAssetForm = false;
    this.showReferenceForm = false;
    this.showFileUploadForm = false;
  }

  onAssetFormShow() {
    this.showLoanInfoForm = false;
    this.showAssetForm = true;
    this.showReferenceForm = false;
    this.showFileUploadForm = false;
  }

  onReferenceFormShow() {
    this.showLoanInfoForm = false;
    this.showAssetForm = false;
    this.showReferenceForm = true;
    this.showFileUploadForm = false;
  }

  onFileUploadFormShow() {
    this.showLoanInfoForm = false;
    this.showAssetForm = false;
    this.showReferenceForm = false;
    this.showFileUploadForm = true;
  }

  onNext() {
    this.onAssetFormShow();
  }

  onAssetBack(event: any) {
    this.onLoanFormShow();
  }

  getAssets(event: ILoanAssets[]) {
    this.loanAssetList = event;
    this.onReferenceFormShow();
  }

  onReferenceBack(event: any) {
    this.onAssetFormShow();
  }

  getReferences(event: ILoanReference[]) {
    this.loanReferenceList = event;
    this.onFileUploadFormShow();
  }

  onSubmit() {
    this.loanApplication = {
      ProductId: this.f.product.value,
      BranchId: this.f.branch.value,
      Tenure: parseInt(this.f.tenure.value),
      Amount: parseInt(this.f.amount.value),
      LoanAssets: this.loanAssetList,
      LoanReferances: this.loanReferenceList,
      LoanDocuments: this.documentList,
    };

    this.loader = true;
    this.loanService
      .saveLoanApplication(this.loanApplication)
      .subscribe((res) => {
        if (res.Status === 'OK') {
          let loanReqID = res.Result.toString();
          this.saveLoanDocuments(loanReqID);
        } else if (res.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = res.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loader = false;
      });
  }

  saveLoanDocuments(loanReqID: string) {
    this.loader = true;
    this.uploadedDocs.map((document) => {
      let formData = new FormData();
      formData.append('LoanRequestID', loanReqID);
      formData.append('documentID', document.doc_id);
      formData.append('productID', this.f.product.value);
      formData.append('branchID', this.f.branch.value);
      console.log(document.doc);
      formData.append('document', document.doc, document.doc.name);
      return this.loanService
        .saveLoanDocument(formData)
        .subscribe((response) => {
          console.log(response);
          if (response.Status === 'UNAUTH') {
            this.authenticationService.logout();
          } else {
            this.docResponse.push({
              doc_name: document.doc_name,
              fileName: document.doc.name,
              status: response.Status,
            });
          }
        });
    });
    this.popupError = false;
    this.header = 'Success';
    this.message = 'Loan Application Successful';
    this.btnText = 'Close';
    this.popup = true;
    this.loader = false;
    this.resetForm();
  }

  resetForm() {
    this.loanForm.reset();
    this.assetForm.reset();
    this.f.branch.setValue('');
    this.f.product.setValue('');
    this.loanAppSuccess = true;
    this.loanProductList = [];
    this.selectedProduct = null;
    this.loanAssetList = [];
    this.loanReferenceList = [];
    this.productDocumentList = [];
    this.loanApplication = null;
    this.currentDocumentIndex = 0;
    this.uploadedDocs = [];
    this.documentList = [];
    this.loanAppSuccess = false;
    this.mandatoryFiles = false;
    this.showLoanInfoForm = true;
    this.showAssetForm = false;
    this.showReferenceForm = false;
    this.showFileUploadForm = false;
  }

  onCloseModal(close: boolean) {
    this.popup = close;
    this.docResponse = [];
  }

  // Loan Asset

  resetAssetForm()
  {    
      this.assetForm.reset();
      this.loanAsset = null;
      this.loanAssetList = [];
      this.asset.chkEncumbered.setValue(true);  
  }
  get asset() {
    return this.assetForm.controls;
  }

  onAddAsset() {
    this.loanAsset = {
      AssetDetails: this.asset.txtAssetDetails.value,
      PresentMarketValue: this.asset.txtPresentMarketValue.value,
      LocationDescription: this.asset.txtLocation.value,
      Liabilities: this.asset.txtLiabilities.value,
      EncumberedUnencumbered: this.asset.chkEncumbered.value,
    };
    this.loanAssetList.push(this.loanAsset);
    this.assetDataSource.data = this.loanAssetList;
    this.assetForm.reset();
    this.asset.chkEncumbered.setValue(true);
  }

  onDeleteAsset(element: any) {
    this.loanAssetList = this.loanAssetList.filter(
      (loanAsset) => loanAsset !== element
    );
    this.assetDataSource.data = this.loanAssetList;
  }

  // Loan Reference
  get ref() {
    return this.referenceForm.controls;
  }

  onAddReference() {
    this.loanReference = {
      ReferenceName: this.ref.txtReferenceName.value,
      ReferenceRelation: this.ref.txtReferenceRelation.value,
      ReferenceProfession: this.ref.txtProfession.value,
      ReferenceEduQualification: this.ref.txtEducation.value,
      ReferenceEmail: this.ref.txtEmail.value,
      ReferenceMobile: this.ref.txtMobileNo.value,
    };
    this.loanReferenceList.push(this.loanReference);
    this.referenceDataSource.data = this.loanReferenceList;
    this.referenceForm.reset()
  }

  onDeleteReference(element: any) {
    this.loanReferenceList = this.loanReferenceList.filter(
      (loanReference) => loanReference !== element
    );
    this.referenceDataSource.data = this.loanReferenceList;
  }
}
