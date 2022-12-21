import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IGetRequestWithDetails } from 'src/app/models/requestWithDetails.model';

@Component({
  selector: 'app-request-log-details-popup',
  templateUrl: './request-log-details-popup.component.html',
  styleUrls: ['./request-log-details-popup.component.css']
})
export class RequestLogDetailsPopupComponent implements OnInit {

  @Input() popupError: boolean;
  @Input() header: string;
  @Input() btnText: string;
  @Input() btnDisable?: boolean;
  @Input() requestDetails?: IGetRequestWithDetails = {};
  @Input() custStyle?: string;
  @Output() close = new EventEmitter<boolean>();

  date = new Date();
  isStatement            : boolean = false;
  isStopCheque           : boolean = false;
  isChequeIssue          : boolean = false;
  isComplain             : boolean = false;
  isAddressChange        : boolean = false;
  isLostCard             : boolean = false;
  isPositivePay          : boolean = false;
  isPayOrder             : boolean = false;
  isPaperCertificate     : boolean = false;

  statementDetails       : any = null;
  stopChequeDetails      : any = null;
  chequeIssueDetails     : any = null;
  complainDetails        : any = null;
  addressChangeDetails   : any = null;
  lostCardDetails        : any = null;
  positivePayDetails     : any = null;
  payOrderDetails        : any = null;
  paperCertificateDetails: any = null;
 

  constructor() { }

  ngOnInit() {    
    if (this.requestDetails.details.addressChange) {
      this.isAddressChange = true;
      this.addressChangeDetails = this.requestDetails.details.addressChange;
    }
    if (this.requestDetails.details.chequeIssue) {
      this.isChequeIssue = true;
      this.chequeIssueDetails = this.requestDetails.details.chequeIssue;
    }
    if (this.requestDetails.details.complain) {
      this.isComplain = true;
      this.complainDetails = this.requestDetails.details.complain;
    }
    if (this.requestDetails.details.lostCard) {
      this.isLostCard = true;
      this.lostCardDetails = this.requestDetails.details.lostCard;
    }
    if (this.requestDetails.details.paperCertificate) {
      this.isPaperCertificate = true;
      this.paperCertificateDetails = this.requestDetails.details.paperCertificate;
    }
    if (this.requestDetails.details.payOrder) {
      this.isPayOrder = true;
      this.payOrderDetails = this.requestDetails.details.payOrder;
    }
    if (this.requestDetails.details.positivePay) {
      this.isPositivePay = true;
      this.positivePayDetails = this.requestDetails.details.positivePay;
    }
    if (this.requestDetails.details.statement) {
      this.isStatement = true;
      this.statementDetails = this.requestDetails.details.statement;
    }
    if (this.requestDetails.details.stopCheque) {
      this.isStopCheque = true;
      this.stopChequeDetails = this.requestDetails.details.stopCheque;
    }
  }

  onClose() {
    this.close.emit(false);
  }

}
