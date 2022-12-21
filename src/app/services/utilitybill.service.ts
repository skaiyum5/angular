import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootResponse } from '../models/root-response.model';
import { IUtilitybillpayment } from '../models/utilitybillpayment.model';
import { IUtilitybillVendorResponse } from '../models/utilityvendor.model';
import { IBillZoneResponse } from '../models/utilitybillvendorzone.model';
import { IUtilityBillCategoryResponse } from '../models/utilitybillcategory.model';
import { ISimOfferDetails } from '../models/topup_simofferdetails.model';

@Injectable({
  providedIn: 'root'
})
export class UtilitybillService {

  constructor(private http: HttpClient) { }

  private getParam(utilityParam: IUtilitybillpayment): HttpParams {

    let httpParams = new HttpParams().set("utilityServiceBillType", utilityParam.utilityServiceBillType)
      .set("transactionSourceId", utilityParam.transactionSourceId)
      .set("comments", utilityParam.comments)
      .set("billNumber", utilityParam.billNumber)
      .set("billamount", utilityParam.billamount)
      .set("billAccountNumber", utilityParam.billAccountNumber)
      .set("billMobileNumber", utilityParam.billMobileNumber)
      .set("billZone", utilityParam.billZone)
      .set("billMonth", utilityParam.billMonth)
      .set("billYear", utilityParam.billYear)
      .set("customerid", utilityParam.customerid)
      .set("customerName", utilityParam.customerName)
      .set("frombillmonth", utilityParam.frombillmonth)
      .set("frombillyear", utilityParam.frombillyear)
      .set("tobillmonth", utilityParam.tobillmonth)
      .set("tobillyear", utilityParam.tobillyear)
      .set("billPaymentType", utilityParam.billPaymentType)
      .set("currencyType", utilityParam.currencyType)
      .set("paymentBranchId", utilityParam.paymentBranchId)
      .set("paymentAccountNumber", utilityParam.paymentAccountNumber)
      .set("TPIN", utilityParam.TPIN)
      .set("OTP", utilityParam.OTP)
      .set("slNo", utilityParam.slNo)
      .set("ppvCode", utilityParam.ppvCode)
      .set("ppvName", utilityParam.ppvName);

      return httpParams;
  }

  getUtilityBillEnquiry(utilityParam: IUtilitybillpayment): Observable<RootResponse<IUtilitybillpayment>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    return this.http.post<RootResponse<IUtilitybillpayment>>(`${environment.rootUrl}/api/UtilityBill/UtilityBillEnquery`, utilityParam, { headers: reqHeader});
  }

  saveUtilityBillPayment(utilityParam: IUtilitybillpayment): Observable<RootResponse<IUtilitybillpayment>> {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RootResponse<IUtilitybillpayment>>(`${environment.rootUrl}/api/UtilityBill/UtilityBillPayment`, utilityParam, { headers: reqHeader });
  } 

  // Get Provider/Vendor List
  getUtilityBillVendorList(): Observable<RootResponse<IUtilitybillVendorResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IUtilitybillVendorResponse>>(
      `${environment.rootUrl}/api/UtilityBill/GetUtilityList`,
      { headers: reqHeader }
    );
  }

  getBillZone(nameValueList: string,
    pvCode: string): Observable<RootResponse<IBillZoneResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('pname_value_list', nameValueList)
      .set('ppv_code', pvCode);

    return this.http.get<RootResponse<IBillZoneResponse>>(
      `${environment.rootUrl}/api/BankAccount/EnquiryGetProviderORVendorZone`,
      { headers: reqHeader, params: httpParams }
    );
  }
  
  getUtilityBillCategory(pvCode: string): Observable<RootResponse<IUtilityBillCategoryResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()      
      .set('ppvCode', pvCode);

    return this.http.get<RootResponse<IUtilityBillCategoryResponse>>(
      `${environment.rootUrl}/api/UtilityBill/getUtilityCategoryList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  saveTopUp(topUpParam: IUtilitybillpayment): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post<any>(
      `${environment.rootUrl}/api/UtilityBill/UtilityBillPayment`,
      topUpParam,
      { headers: reqHeader }
    );
  }

  getSimOfferDetails(oparator: string, oparatorType: string): Observable<RootResponse<ISimOfferDetails>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('oparator', oparator.toUpperCase())
      .set('oparatorType', oparatorType.toUpperCase());

    return this.http.get<RootResponse<ISimOfferDetails>>(
      `${environment.rootUrl}/api/UtilityBill/GetSimOfferDetails`,
      { headers: reqHeader, params: httpParams }
    );
  }
}
