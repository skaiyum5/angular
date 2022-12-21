import { Injectable } from '@angular/core';  
import { HttpClient, HttpHeaders  } from '@angular/common/http';  
import { environment } from '../../environments/environment'

@Injectable({  
  providedIn: 'root'  
})  
export class IpServiceService  {  
  
  constructor(private http:HttpClient) { }  
  
  public getIPAddress()  
  {  
    return this.http.get(environment.UserIPUrl);
  }
}  