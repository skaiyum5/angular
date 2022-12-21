export interface IStatementDetails {
  branchID?: string;
  accountNumber?: string;
  fundTransferTypeId?: string;
  count?: string;
  startDate?: string;
  endTime?: string;
}

export interface IStatementDetailsResponse {
  tranS_DATE?: string;
  tranS_MODE?: string;
  chQ_NO?: string;
  narration?: string;
  purposE_OF_TRANSACTION?: string;
  dR_AMOUNT?: string;
  cR_AMOUNT?: null;
  balance?: string;
  openinG_BALANCE?: string;
  currencY_NM?: string;
}

export interface IDownloadStatementParam
{
  branchId ?: string;
  accountNumber ?: string;
  makeBy ?: string;
  transMode ?: string;
  FromDate ?: string;
  ToDate ?: string;
  reportType ?: string;
}

export interface IDownloadStatementResponse
{
  Status ?: string;
  Message ?: string;
  Result ?: string;
}
