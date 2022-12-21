export interface IAccountInterest {
    branchId: string;
    accountNumber: string;
}

export interface IAccountInterestResponse {
    inT_RATE?: string;
    currency?: string;
    inT_TO_MONTH?: string;
    accumulateD_INT?: string;
    inT_PAYABLE?: string;
    totaL_INT?: string;
    lasT_CAL_DT?: string;
    lasT_APPLY_DT?: string;
}