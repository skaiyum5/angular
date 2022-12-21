// export interface IChequeBookList{
//     branchId: string;
//     accountNumber: string;
// }

export interface IChequeBookListResponse{
    chQ_PREFIX?:      string;
    starT_LEAF_NO?:   string;
    enD_LEAF_NO?:     string;
    totaL_LEAVES_NO?: string;
    issuE_DATE?:      string;
}