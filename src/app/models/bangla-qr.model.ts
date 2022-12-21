// Card Registration
export interface ICardRegReq
{
    fullPAN?: string;
    expireMM?: string;
    expireYY?: string;
    dateofBirth?: string;
    mobileNumber?: string;
    emailAddress?: string;
    otp?: string;
    TPIN?:string;
}
export interface ICardRegResp
{
    Status?:  string;
    Message?: string;
    Result?:  null;
}

// Get Registered Card List
export interface IRegisteredCardList {
    id?:   string;
    name?: string;
}

// Registered Card Details
export interface IRegisteredCardDtlsResp {
    Status?:  string;
    Message?: string;
    Result?:  CardDtls;
}

export interface CardDtls {
    cardNo?:          string;
    expiaryMM?:       string;
    expiaryYY?:       string;
    dateOfBirth?:     Date;
    mobileNumber?:    string;
    emailAddress?:    string;
    idClient?:        string;
    cardStatus?:      string;
    issueDate?:       string;
    ownerName?:       string;
    ownerGender?:     string;
    ownerMotherName?: string;
}