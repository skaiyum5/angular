import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  fileValue: any = '';

  year:any;
  constructor(private http: HttpClient) { }
  ngOnInit(): void {    
    
    this.http.get('assets/files/About-Us.txt', {responseType: 'text'})
        .subscribe(data => this.fileValue = data);
    this.year=new Date().getFullYear();
  }

}
