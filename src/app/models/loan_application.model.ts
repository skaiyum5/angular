import { ILoanAssets } from './loan_assets.model';
import { ILoanReference } from './loan_references.model';

export interface ILoanApplication {
  ProductId: string;
  BranchId: string;
  Tenure: number;
  Amount: number;
  LoanAssets: ILoanAssets[];
  LoanReferances: ILoanReference[];
  LoanDocuments: {
    DocumentId: string;
    DocumentNM: string;
  }[];
}
