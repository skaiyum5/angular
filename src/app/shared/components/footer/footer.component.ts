import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerLogo: string = '';
  footerBankLogo: string = `assets/images/FSIBL_Logo.png`;  
  year:any;
  constructor() { }
  ngOnInit(): void {
  this.year=new Date().getFullYear();
  }

}
