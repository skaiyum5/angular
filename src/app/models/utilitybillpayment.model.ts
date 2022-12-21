export interface IUtilitybillpayment {
  ownBankCreditCardDetails?:object;
  utilityServiceBillType?: string;
  transactionSourceId?: string;
  comments?: string;
  billNumber?: string;
  billCategory?: string,
  billamount?: string;
  billAccountNumber?: string;
  billMobileNumber?: string;
  operatorId?: string;
  billZone?: string;
  billMonth?: string;
  billYear?: string;
  customerid?: string;
  requestid?: string;
  customerName?: string;
  frombillmonth?: string;
  frombillyear?: string;
  tobillmonth?: string;
  tobillyear?: string;
  billPaymentType?: string;
  currencyType?: string;
  paymentBankId?: string;
  paymentBranchId?: string;
  paymentAccountNumber?: string;
  TPIN?: string;
  OTP?: string;
  slNo?: string;
  ppvCode?: string;
  ppvName?: string;
}
