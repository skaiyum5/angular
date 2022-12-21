export interface IBeneficiary {
    beneficiaryId?:    number;
    userId?:           string;
    receiverName?:     string;
    toAccountNo?:      string;
    toBankCode?:       string;
    toBranchCode?:     string;
    toRoutingNum?:     string;
    beneficiaryAlias?: string;
    transferType?:     string;
    receiverType?:     string;
    otp?:              string;
    tpin?:             string;
    discriminator?:    string;
    status?:           number;
    createDt?:         Date;
    createIp?:         string;
    updateDt?:         Date;
    updateIp?:         string;
    logoUrl?:          string;

    // BeneficiaryId?:    number;
    // UserId?:           string;
    // ReceiverName?:     string;
    // ToAccountNo?:      string;
    // ToBankCode?:       string;
    // ToBranchCode?:     string;
    // ToRoutingNum?:     string;
    // BeneficiaryAlias?: string;
    // TransferType?:     string;
    // ReceiverType?:     string;
    // Otp?:              string;
    // Tpin?:             string;
    // Discriminator?:    string;
    // Status?:           number;
    // CreateDt?:         Date;
    // CreateIp?:         string;
    // UpdateDt?:         Date;
    // UpdateIp?:         string;
    // logoUrl?:          string;
}
