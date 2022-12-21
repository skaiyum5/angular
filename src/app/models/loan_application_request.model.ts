export interface ILoanApplicationRequest {
  loanrequestid: number;
  userId: string;
  userNm: string;
  customerId: string;
  groupId: string;
  productId: string;
  productNm: string;
  email: string;
  mobile: string;
  tenure: string;
  amount: string;
  status: boolean;
  makeBy: string;
  makeDt: string;
  branchId: string;
  branchNm: string;
  authStatus: string;
}
