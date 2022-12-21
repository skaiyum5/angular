export interface IUsedChequeDetail{
    branchId:       string;
    accountNumber:  string;
    chequePrefix:   string;
    startLeafNo:    string;
    endLeafNo:      string;
}

export interface IUsedChequeDetailResponse{
    tranS_DATE: string;
    leaF_NO:    string;
    amount:     string;
    status:     string;    
}