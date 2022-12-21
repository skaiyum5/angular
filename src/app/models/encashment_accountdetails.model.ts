export interface IEncashmentAccountParam{
    encashmentBranchID?: string;
    encashmentAccountNo?: string;
}

export interface IEncashmentAccountDetailsResponse{
    productID?:          string;
    productName?:        string;
    productServiceType?: string;
    principalAmount?:    string;
    maturityAmount?:     string;
    term?:               string;
    termFrequency?:      string;
    maturityDate?:       string;
}