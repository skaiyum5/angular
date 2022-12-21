export interface IAccountOpeningLog {
    requestId?:         number;
    requestDt?:         Date;
    branchId?:          string;
    branchNm?:          string;
    accountNo?:         string;
    accountTitle?:      string;
    productId?:         string;
    productNm?:         string;
    specialInst?:       string;
    mailAddrs?:         string;
    principalAmount?:   number;
    futureAmt?:         number;
    installmentAmount?: number;
    trmFreq?:           string;
    trmTotNo?:          number;
    pnsnMatFlag?:       boolean;
    renewFlag?:         boolean;
    payInFlag?:         boolean;
    payeeBranchId?:     string;
    payeeAccountNo?:    string;
    status?:            number;
    processFlag?:       boolean;
    processBy?:         string;
    processDt?:         Date;
    createBy?:          string;
    createDt?:          Date;
    updateDt?:          Date;
    updateBy?:          string;
    ischecked?:         boolean;
    checkBy?:           string;
    checkDt?:           Date;
    isauthorized?:      boolean;
    authorizeBy?:       string;
    authorizeDt?:       Date;
    islocked?:          boolean;
    lockBy?:            null;
    lockDt?:            null;
    lockReason?:        null;
    productType?:       string;
}

export interface IAccountOpeningReceipt
{
    Status ?: string;
    Message ?: string;
    Result ?: string;
}
