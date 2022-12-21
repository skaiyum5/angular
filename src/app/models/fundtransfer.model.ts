export interface IFundTransferTypeResponse {
  id?: string;
  title?: string;    
  logo?:string;
  serial?: number;
}

export interface IFundTransfer {
  TRANSFER_TYPE_CBS?: string;
  IB_CLIENT_ID_LABEL?: string;
  VIOLATE_FUND_TRANSFER_GENERIC_POLICY?: string;
  PURPOSE_OF_TRANSACTION?: string;
  TRANSFER_TYPE?: string;
  BANK_ID?: string;
  RECEIVER_ID?: string;
  RECEIVER_NM?: string;
  ROUTING_NUMB?: string;
  TRANS_CODE?: string;
  SEC_CODE?: string;
  TRANSACTION_ORIGINATED_BY?: string;
  ADDENDA_INFORMATION?: string;
  OTP?: string;
  TPIN?: string;
  RTGS_ADDRESS?: string;
  RTGS_CITY?: string;
  RTGS_COUNTRY?: string;
  OTHER_BANK_BRANCH_ID?: string;
  NARRATION?: string;
  FROM_BRANCH_NM?: string;
  FROM_TRANS_DT?: string;
  FROM_BRANCH_ID?: string;
  FROM_ACCOUNT_NO?: string;
  TO_BRANCH_ID?: string;
  TO_ACCOUNT_NO?: string;
  AMOUNT_CCY?: string;
  AMOUNT_LCY?: string;
  BRANCH_AUTH_FLAG?: string;
  BATCH_NO?: string;
  IB_LOG_SL?: string;
  IB_DT?: string;
  IB_USER_ID?: string;
  IB_CUST_ID?: string;
  IB_IP_ADDRESS?: string;
}
