import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RootResponse } from '../models/root-response.model';

import { IGetBeneficiaryResponse } from '../models/instruction_getbeneficiary.model';
import { InstructionBeneficiary, IGetInstructionResponse } from '../models/instruction_getinstruction.model';
import { INewInstruction } from '../models/instruction_newinstruction.model';

@Injectable({
  providedIn: 'root',
})
export class StandingInstructionService {
  constructor(private http: HttpClient) {}

  // Get Instructions
  getInstructions(
    branchId: string
  ): Observable<RootResponse<IGetInstructionResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('branchId', branchId);

    return this.http.get<RootResponse<IGetInstructionResponse>>(
      `${environment.rootUrl}/api/Instruction/GetInstructions`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Get Beneficiary
  getBeneficiary(
    branchId: string
  ): Observable<RootResponse<IGetBeneficiaryResponse>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams().set('BranchId', branchId);

    return this.http.get<RootResponse<IGetBeneficiaryResponse>>(
      `${environment.rootUrl}/api/Instruction/GetBeneficiaryAccountList`,
      { headers: reqHeader, params: httpParams }
    );
  }

  // Create Scheme Account Encashment Request
  createNewStandingInstruction(
    param: INewInstruction
  ): Observable<RootResponse<INewInstruction>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RootResponse<INewInstruction>>(
      `${environment.rootUrl}/api/Instruction/AddInstruction`,
      param,
      { headers: reqHeader }
    );
  }
}
