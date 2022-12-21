export interface IGetRequestWithDetails {
    requestType?: string;
    requestDate?: string;
    status?: Status;
    details?: Details;
}

export interface Details {
    statement?: Statement | null;
    stopCheque?: StopCheque | null;
    chequeIssue?: ChequeIssue | null;
    complain?: Complain | null;
    addressChange?: AddressChange | null;
    lostCard?: LostCard | null;
    positivePay?: PositivePay | null;
    payOrder?: PayOrder | null;
    paperCertificate?: PaperCertificate | null;
}

export interface AddressChange {
    addressType?: string;
    address1?: string;
    address2?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    state?: string;
    division?: string;
    district?: string;
    thana?: string;
    phone?: string;
    mobile?: string;
    mobile2?: string;
    mobile3?: string;
    mobile4?: string;
    mobile5?: string;
    email?: string;
    fax?: string;
    telex?: string;
    swift?: string;
    web?: string;
    contactPersonNm?: string;
    contactPersonDesig?: string;
    contactPersonPhone?: string;
    contactPersonMobile?: string;
    contactPersonEmail?: string;
    upozilaCitycorp?: string;
    unionMuni?: string;
    villWard?: string;
    isCitycorp?: null;
}

export interface ChequeIssue {
    branchId?: string;
    accountNo?: string;
    definationId?: string;
    bookLeaf?: number;
    deliveryBranchId?: string;
}

export interface Complain {
    branchId?: string;
    subject?: string;
    description?: string;
}

export interface LostCard {
    branchId?: string;
    cardType?: string;
    cardNo?: string;
    instruction?: string;
}

export interface PaperCertificate {
    branchid?: string;
    accountnumber?: string;
    certificatetype?: string;
    purpose?: string;
    refaranceNo?: string;
}

export interface PayOrder {
    branchid?: string;
    accountnumber?: string;
    beneficiaryname?: string;
    amount?: number;
    refaranceNo?: string;
}

export interface PositivePay {
    branchId?: string;
    accountNo?: string;
    instNo?: string;
    instAmt?: number;
    startDate?: Date;
    expDate?: Date;
    brmProdId?: null;
    beneficiaryName?: string;
    otp?: null;
    tpin?: null;
}

export interface Statement {
    branchId?: string;
    accountNumber?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface StopCheque {
    branchId?: string;
    accountNumber?: string;
    chequePrefix?: string;
    startLeafNo?: number;
    endLeafNo?: number;
    stopCheckNo?: number;
    chequeAmount?: number;
    chequeDate?: Date;
    beneficiary?: string;
    reason?: null;
    tpin?: null;
    otp?: null;
}

export enum Status {
    Declined = "Declined",
    Processed = "Processed",
    Processing = "Processing",
    RequestSuccessful = "Request Successful",
}
