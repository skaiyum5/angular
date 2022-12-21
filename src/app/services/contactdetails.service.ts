import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';
import { IUserProfileDetailResponse } from '../models/userdetailsprofile.model';
import { ICustomerProfilePhoto } from '../models/customerdoc.model';
import { IUserFullAddress } from '../models/user_address.model';
import { IDivisionList, IDistrictList, IThanaList, IUpozilaCitycorporationList, IUnionMunicipalityList, IVillageWardList } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class ContactdetailsService {
  constructor(private http: HttpClient) {}

  getUserProfileDetails(): Observable<RootResponse<IUserProfileDetailResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IUserProfileDetailResponse>>(
      `${environment.rootUrl}/api/Profile/GetFullProfileDetail`,
      { headers: reqHeader }
    );
  }

  getCustomerProfilePhoto(): Observable<ICustomerProfilePhoto> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<ICustomerProfilePhoto>(
      `${environment.rootUrl}/api/CustomerDoc/GetCustomerProfilePhoto`,
      { headers: reqHeader }
    );
  }

  getUserFullAddress(): Observable<RootResponse<IUserFullAddress[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IUserFullAddress[]>>(
      `${environment.rootUrl}/api/Profile/GetFullAddressDetail`,
      { headers: reqHeader }
    );
  }

  // Location
  getDivisionList(): Observable<RootResponse<IDivisionList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<RootResponse<IDivisionList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetDivisionList`,
      { headers: reqHeader }
    );
  }

  getDistrictList(divisionId: string): Observable<RootResponse<IDistrictList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('pdivision_id', divisionId);

    return this.http.get<RootResponse<IDistrictList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetDistrictList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getThanaList(districtId: string): Observable<RootResponse<IThanaList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('pdistrict_id', districtId);

    return this.http.get<RootResponse<IThanaList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetThanaList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getUpozilaCitycorporationList(districtId: string): Observable<RootResponse<IUpozilaCitycorporationList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('pdistrict_id', districtId);

    return this.http.get<RootResponse<IUpozilaCitycorporationList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetUpozilaCitycorporationList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getUnionMunicipalityList(upozilaId: string): Observable<RootResponse<IUnionMunicipalityList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('pupozila_citycorp_id', upozilaId);

    return this.http.get<RootResponse<IUnionMunicipalityList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetUnionMunicipalityList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  getVillageWardList(unionId: string): Observable<RootResponse<IVillageWardList[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('punion_muni_id', unionId);

    return this.http.get<RootResponse<IVillageWardList[]>>(
      `${environment.rootUrl}/api/BankAccount/GetVillageWardList`,
      { headers: reqHeader, params: httpParams }
    );
  }

}
