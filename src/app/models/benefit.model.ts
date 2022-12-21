export interface IBenefitResponse {
    Typeid?:         string;
    Benefitid?:      string;
    Companyname?:    string;
    Discountinfo?:   string;
    Discountamount?: string;
    Address?:        string;
    Weburl?:         string;
    Contact?:        string;
    Branchid?:       string;
    Accountno?:      string;
    Logourl?:        string;
    Type?:           Type;
    Image?:          null;
}

export interface Type {
    Typeid?:       string;
    Logo?:         null;
    Typename?:     string;
    Createdby?:    null;
    Createdat?:    null;
    Status?:       null;
    Updatedat?:    null;
    Updatedby?:    null;
    Islocked?:     null;
    Lockedby?:     null;
    Lockedat?:     null;
    Lockedreason?: null;
}