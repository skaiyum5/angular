export interface IGetEncashmentRequest{
    requestID:          number;
    payeeBranchID:      string;
    payeeAccountNo:     string;
    branchID:           string;
    accountNo:          string;
    accounttitle:       string;
    customerId:         string;
    productID:          string;
    productName:        string;
    productServiceType: string;
    principalAmount:    string;
    currentBalancelcy:  string;
    currentBalanceccy:  string;
    maturityAmount:     string;
    term:               string;
    termFrequency:      null;
    maturityDate:       string;
    status:             string;
}