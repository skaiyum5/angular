export interface IAccountBalance {
    branchId: string;
    accountNumber: string;
}

export interface IAccountBalanceResponse {
    currencY_NM?:       string;
    currenT_BALANCE?:   string;
    clearinG_AMT?:      string;
    blockeD_AMOUNT?:    string;
    holD_AMOUNT?:       string;
    lieN_AMOUNT?:       string;
    pendinG_DR?:        string;
    pendinG_CR?:        string;
    availablE_BALANCE?: string;
    miN_BALANCE?:       string;
}