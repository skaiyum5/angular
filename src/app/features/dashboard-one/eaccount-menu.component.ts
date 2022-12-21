import { Component, Input, OnInit } from '@angular/core';
import { IMenu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-eaccount-menu',
  templateUrl: './eaccount-menu.component.html',
  styleUrls: ['./eaccount-menu.component.css']
})
export class EaccountMenuComponent implements OnInit {
  @Input() menu: IMenu;

  constructor() { }

  ngOnInit(): void {
  }

}
