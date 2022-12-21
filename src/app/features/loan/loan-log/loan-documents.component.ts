import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ILoanDocumentResponseDetails } from 'src/app/models/loan_applicataion_request_details.model';
import { LoanService } from 'src/app/services/loan.service';

@Component({
  selector: 'app-loan-documents',
  templateUrl: './loan-documents.component.html',
  styleUrls: ['./loan-documents.component.css'],
})
export class LoanDocumentsComponent implements OnInit {
  @Input() loanUploadedDocuments: ILoanDocumentResponseDetails[];
  uploadedDocuments: any[] = [];
  @Input() loanMissingDocuments: any[];
  @Input() branchId: string;
  @Input() productId: string;
  @Input() loanRequestId: number;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private domSanitizer: DomSanitizer,
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loanUploadedDocuments.map((document) => {
      let doc = {
        doc_id: document.documentId,
        doc_name: document.documentNM,
        doc_type: document.documentExtention === 'pdf' ? 'pdf' : 'image',
        imageUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(
          `data:${
            document.documentExtention === 'pdf' ? 'application' : 'image'
          }/${document.documentExtention};base64,${document.documentData}`
        ),
      };
      this.uploadedDocuments.push(doc);
    });
  }

  isUploadDisabled(id: string) {
    let fileInput = (<HTMLInputElement>document.getElementById(id))?.value;
    if (fileInput === '') {
      return true;
    }
    return false;
  }

  uploadLoanDocument(id: string, loanid: string) {
    let file = (<HTMLInputElement>document.getElementById(id))?.files[0];

    let documentID = id.split('e')[1];

    let formData = new FormData();

    formData.append('branchID', this.branchId);
    formData.append('productID', this.productId);
    formData.append('LoanRequestID', loanid);
    formData.append('documentID', documentID);
    formData.append('document', file, file.name);

    this.loanService.saveLoanDocument(formData).subscribe((response) => {
      if (response.Status === 'OK') {
        this.popupError = false;
        this.header = 'Success';
        this.message = response.Message;
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
    this.router.navigate(['/investment/log']).then(() => {
      this.router.navigate([`/investment/details/${this.loanRequestId}`])
    })
  }
}
