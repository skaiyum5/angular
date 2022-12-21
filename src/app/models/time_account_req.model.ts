import { ITimeAccDetails } from './time_acc_details.model';

export interface ITimeAccountReq {
  saveTimeDetailsViewModel?: {
    productID: string;
    branchID: string;
    paymentBranchID: string;
    paymentAccountNO: string;
    chkTransferInterest: boolean;
  };
  timeDetails?: ITimeAccDetails;
}
