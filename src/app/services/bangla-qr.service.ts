import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ICardRegReq, ICardRegResp, IRegisteredCardList, IRegisteredCardDtlsResp  } from '../models/bangla-qr.model';
import { IProcessPayLoadResp  } from '../models/banglaQR_ProcessPayLoad.model';
import { ITransactionReq } from '../models/banglaQR_TransactionReq.model';


import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse, ISingleResponse } from '../models/root-response.model';


@Injectable({
  providedIn: 'root',
})
export class BanglaQrService {
  constructor(private http: HttpClient) {}

  cardRegistration(requestParam: ICardRegReq): Observable<ICardRegResp> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<ICardRegResp>(
      `${environment.rootUrl}/api/BanglaQR/CardRegistration`, requestParam,
      { headers: reqHeader }
    );
  }

  getRegisteredCardList(): Observable<RootResponse<IRegisteredCardList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<IRegisteredCardList[]>>(
      `${environment.rootUrl}/api/BanglaQR/GetRegisteredCardsList`,
      { headers: reqHeader }
    );
  }

  getRegisteredCardDeails(HashCardNo: string): Observable<IRegisteredCardList> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('HashCardNo', HashCardNo);

    return this.http.get<IRegisteredCardList>(
      `${environment.rootUrl}/api/BanglaQR/GetRegisteredCardsDetails`,
      { headers: reqHeader, params: httpParams }
    );
  }

  processPayLoad(payLoad: string): Observable<IProcessPayLoadResp> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('payLoad', payLoad);

    return this.http.get<IProcessPayLoadResp>(
      `${environment.rootUrl}/api/BanglaQR/ProcessPayLoad`,
      { headers: reqHeader, params: httpParams }
    );
  }

  createTransaction(requestParam: ITransactionReq): Observable<RootResponse<ITransactionReq>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RootResponse<ITransactionReq>>(
      `${environment.rootUrl}/api/BanglaQR/Transaction`, requestParam,
      { headers: reqHeader }
    );
  }

}