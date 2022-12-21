export interface IUnUsedChequeDetail{
    branchId?:       string;
    accountNumber?:  string;
    chequePrefix?:   string;
    startLeafNo?:    string;
    endLeafNo?:      string;
}

export interface IUnUsedChequeDetailResponse{
    _CHQ_PREFIX: string;
    _LEAF_NO:    string;
    _STATUS:     string;       
}