import { IBulkFundTransfer } from './bulk_fund_transfer.model';

export interface IBulkFundTransferRequest {
  ftLogs?: IBulkFundTransfer[];
  OTP?: string;
  TPIN?: string;
}
