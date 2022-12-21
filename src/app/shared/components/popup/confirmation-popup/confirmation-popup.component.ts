import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {
  @Input() popupError: boolean;
  @Input() header: string;
  @Input() message: string;
  @Input() btnText: string;
  @Input() btnDisable?: boolean;
  @Input() fromAccount?: string;
  @Input() toAccount?: string;
  @Input() accountName?: string;
  @Input() amount?: string;
  @Input() remarks?: string;
  @Input() custStyle?: string;
  @Input() goBack: Function

  date = new Date();
  popupPending: boolean = false;

  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    if(this.header == 'Confirm')
    {
      this.header = 'Confirm?'
      this.popupPending = true;
    }
  }

  onClose() {
    this.close.emit(false);
  }
  
  backClick() {
    this.goBack();
  }

}
