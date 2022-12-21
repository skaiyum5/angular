import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  year:any;
   
    @ViewChild('divBinder') divBinder: ElementRef<HTMLElement>;

    constructor(private http: HttpClient) { }
    
    
    ngOnInit(): void {
      this.http.get('assets/files/Privacy-Policy.txt', {responseType: 'text'})
        .subscribe(data => this.divBinder.nativeElement.innerHTML = data);    
        this.year=new Date().getFullYear();    
    } 

  // ngOnInit(): void {    
    
  //   // this.http.get('assets/files/Privacy-Policy.txt', {responseType: 'text'})
  //   //     .subscribe(data => this.fileValue = data);
  //   // this.year=new Date().getFullYear();
  // }

}
