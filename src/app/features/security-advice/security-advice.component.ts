import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-security-advice',
  templateUrl: './security-advice.component.html',
  styleUrls: ['./security-advice.component.css']
})
export class SecurityAdviceComponent implements OnInit {

  fileValue: any = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {    
    
    this.http.get('assets/files/Security-Advice.txt', {responseType: 'text'})
        .subscribe(data => this.fileValue = data);

  }  
}
