import { ILoanApplicationRequest } from './loan_application_request.model';
import { ILoanAssets } from './loan_assets.model';
import { ILoanReference } from './loan_references.model';

export interface ILoanApplicationRequestDetails {
  loanApplicationDetail: ILoanApplicationRequest;
  loanAssetDetails: ILoanAssetResponse[];
  loanReferanceDetails: ILoanReferenceResponse[];
  loanUploadedDocumentsDetails: ILoanDocumentResponseDetails[];
  loanMissingDocumentsDetails: any[];
  loanAuthDetails: ILoanAuthDetails[];
}

export interface ILoanAssetResponse {
  assetDetails: string;
  presentMarketValue: string;
  locationDescription: string;
  encumberedUnencumbered: boolean;
  liabilities: string;
  loanassetid: number;
  loanrequestid: number;
  status: boolean;
  makeBy: string;
  makeDt: string;
}

export interface ILoanReferenceResponse {
  referenceName: string;
  referenceRelation: string;
  referenceProfession: string;
  referenceEduQualification: string;
  referenceEmail: string;
  referenceMobile: string;
  loanreferencetid: number;
  loanrequestid: number;
  status: boolean;
  makeBy: string;
  makeDt: string;
}

export interface ILoanDocumentResponseDetails {
  loandocid: number;
  loanrequestid: number;
  documentId: string;
  documentNM: string;
  documentMendatory: string;
  documentExtention: string;
  documentPath: string;
  documentData: string;
  status: boolean;
  makeBy: string;
  makeDt: string;
}

interface ILoanAuthDetails {
  loanauthid: number;
  loanrequestid: number;
  authStatus: string;
  remarks: string;
  status: boolean;
  makeBy: string;
  makeDt: string;
}
