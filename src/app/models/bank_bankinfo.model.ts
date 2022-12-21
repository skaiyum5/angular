export interface IBankInfo{
    value: string;
}
export interface IBankContact{
aboutId: string,
international: string,
localNumber: string,
mailAddress: string,
officeAddress: string,
}

export interface IBankInfoResponse{
    banK_ID?:  string;
    banK_NM?:  string;
    logO_URL?: string;
}