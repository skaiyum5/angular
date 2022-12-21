export interface ITransactionReceiptParam
{
      FTandUTServiceID?: string;
      count?:number;
      startDate?: string;
      endTime?: string;
}

export interface ITransactionReceiptResponse
{
      iB_CUST_ID?: string;
      transactioN_DATE?: string;
      transactioN_DATE_NM?: string;
      transfeR_TYPE?: string;
      transfeR_TYPE_NM?: string;
      froM_BRANCH_ID?: string;
      froM_ACCOUNT_NO?: string;
      tO_BRANCH_ID?: string;
      tO_ACCOUNT_NO?: string;
      purposE_OF_TRANSACTION?: string;
      banK_ID?: string;
      receiveR_ID?: string;
      receiveR_NM?: string;
      routinG_NUMB?: string;
      addendA_INFORMATION?: string;
      otheR_BANK_BRANCH_ID?: string;
      rtgS_ADDRESS?: string;
      rtgS_CITY?: string;
      rtgS_COUNTRY?: string;
      amounT_LCY?: string;
      amounT_CCY?: string;
      transactioN_ID?: string;
}

export interface IDownloadTransactionReceipt
{
      Status?: string;
      Message?:string;
      Result?: string;      
}