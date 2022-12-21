//http://192.168.20.218/TouchpointAPI/api/BankAccount/lastNumberofTransactions?branchId=0031&accountNumber=11100002004
export interface ILastNumberofTransactions{
    branchId: string;
    accountNumber: string;
}

export interface ILastNumberofTransactionsResponse{
    tranS_DATE?:             string;
    tranS_MODE?:             string;
    chQ_NO?:                 string;
    narration?:              string;
    purposE_OF_TRANSACTION?: string;
    dR_AMOUNT?:              string;
    cR_AMOUNT?:              string;
    balance?:                string;
    openinG_BALANCE?:        string;
    currencY_NM?:            string;
}