import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() popupError: boolean;
  @Input() header: string;
  @Input() message: string;
  @Input() btnText: string;
  @Input() btnDisable?: boolean;
  @Input() custStyle?: string;
  @Input() goBack: Function

  date = new Date();
  
  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    
  }

  onClose() {
    this.close.emit(false);
  }
  
  backClick() {
    this.goBack();
  }

}
