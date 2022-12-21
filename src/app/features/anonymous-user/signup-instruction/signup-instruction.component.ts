import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup-instruction',
  templateUrl: './signup-instruction.component.html',
  styleUrls: ['./signup-instruction.component.css']
})
export class SignupInstructionComponent implements OnInit {

  fileValue: any = '';

  year:any;
  constructor(private http: HttpClient) { }
  ngOnInit(): void {    
    
    this.http.get('assets/files/Signup-Instruction.txt', {responseType: 'text'})
        .subscribe(data => this.fileValue = data);
    this.year=new Date().getFullYear();
  }
}
