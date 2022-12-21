import { ISchemeDetails } from "./scheme_details.model";

export interface ISchemeAccountReq {
  SchemeDetailsViewModel?: {
    productId: string;
    branchId: string;
    UserID: string;
    chkPayInFlag: boolean;
    chkStandingInstructionFlag: boolean;
    paymentBranchID: string;
    paymentAccountNo: string;
  };
  SchemeDetails?: ISchemeDetails
}
