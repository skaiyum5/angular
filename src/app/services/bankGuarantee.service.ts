import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

import { IBankGuaranteeBeneficiaryType } from '../models/bankGuarantee_beneficiarytype.model';
import { IBankGuaranteeCategory } from '../models/bankGuarantee_category.model';
import { IBankGuaranteeCurrencyType } from '../models/bankGuarantee_currencytype.model';
import { IBankGuaranteeCountry } from '../models/bankGuarantee_country.model';
import { IBankGuaranteePeriod } from '../models/bankGuarantee_period.model';
import { IBankGuaranteeSecurityType } from '../models/bankGuarantee_securitytype.model';
import { IBankGuaranteeType } from '../models/bankGuarantee_type.model';

@Injectable({
  providedIn: 'root',
})
export class BankGuaranteeService {
  constructor(private http: HttpClient) {}

  // Get Bank Guarantee Category
  getBGCategory(): Observable<RootResponse<IBankGuaranteeCategory>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.get<RootResponse<IBankGuaranteeCategory>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllCategory`,
      { headers: reqHeader }
    );
  }

  // Get Bank Guarantee type
  getBGType(categoryId: string): Observable<RootResponse<IBankGuaranteeType>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('guaranteeCategoryID', categoryId);

    return this.http.get<RootResponse<IBankGuaranteeType>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllType`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Bank Guarantee Currency Type
  getBGCurrencyType(categoryId: string): Observable<RootResponse<IBankGuaranteeCurrencyType>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('guaranteeCategoryID', categoryId);

    return this.http.get<RootResponse<IBankGuaranteeCurrencyType>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllCurrencyType`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Bank Guarantee Period
  getBGPeriod(): Observable<RootResponse<IBankGuaranteePeriod>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IBankGuaranteePeriod>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllPeriod`,
      { headers: reqHeader }
    );
  }

  // Get Bank Guarantee Beneficiary Type
  getBGBeneficiaryType(): Observable<RootResponse<IBankGuaranteeBeneficiaryType>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IBankGuaranteeBeneficiaryType>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllBeneficiaryType`,
      { headers: reqHeader }
    );
  }

  // Get Bank Guarantee Country
  getBGCountry(): Observable<RootResponse<IBankGuaranteeCountry>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IBankGuaranteeCountry>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllCountry`,
      { headers: reqHeader }
    );
  }

  // Get Bank Guarantee Security Type
  getBGSecurityType(): Observable<RootResponse<IBankGuaranteeSecurityType>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IBankGuaranteeSecurityType>>(
      `${environment.rootUrl}/api/BankGarantee/getGuaranteeAllSecurityType`,
      { headers: reqHeader }
    );
  }
}
