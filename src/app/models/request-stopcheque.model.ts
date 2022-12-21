export interface IRequestStopCheque {
    BranchId?: string;
    AccountNumber?: string;
    ChequePrefix?: string;
    StartLeafNo?: number;
    EndLeafNo?: number;
    StopCheckNo?: number;
    ChequeAmount?: number;
    ChequeDate?: string;
    Beneficiary?: string;
    Reason?: string;
    TPIN?: string;
    OTP?: string;
  }
  