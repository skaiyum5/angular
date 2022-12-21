export interface IChequeBookDefinitionResponse {
    charge?:      Charge[];
    insT_DEF_ID?: string;
    insT_DEF_NM?: string;
}

export interface Charge {
    narration?:    string;
    tranS_AMOUNT?: string;
}