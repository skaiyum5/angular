import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

import { IAppSettings } from '../models/appsettings.model';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    constructor(private http: HttpClient) { }

    getAppSettingsByKey(Key: string): Observable<IAppSettings> {
        let reqHeader = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let httpParams = new HttpParams()
            .set("Key", Key);            

        return this.http.get<IAppSettings>(
            `${environment.rootUrl}/api/AppConfigs/getAppSettingsbykey`,
            { headers: reqHeader, params: httpParams }
        )
    }
}
