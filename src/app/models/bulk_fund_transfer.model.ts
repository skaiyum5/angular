export interface IBulkFundTransfer {
  sl: string;
  froM_BRANCH_ID: string;
  froM_ACCOUNT_NO: string;
  tO_BRANCH_ID: string;
  tO_ACCOUNT_NO: string;
  amounT_LCY: string;
  amounT_CCY: string;
  narration: string;
  purposE_OF_TRANSACTION: string;
  transfeR_TYPE: string;
  banK_ID: string;
  receiveR_ID: string;
  receiveR_NM: string;
  rtgS_ADDRESS: string;
  rtgS_CITY: string;
  rtgS_COUNTRY: string;
  status: string;
  transactioN_ID: string;
  errormsg: string;
}
