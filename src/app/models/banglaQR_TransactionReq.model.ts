// Transaction Request
export interface ITransactionReq {
    selectedOwnerPANHash?: string;
    selectedMarchentPAN?:  string;
    serialNumber?:         string;
    keyID?:                string;
    key1?:                 string;
    key2?:                 string;
    OTP?:                  string;
    PayLoadData?:          PayLoadData;
}

export interface PayLoadData {
    payloadFormatIndicator_00?:              string;
    pointOfInitiationMethod_01?:             string;
    merchantAccountInformation?:             MerchantAccountInformation;
    merchantCategoryCode_52?:                string;
    transactionCurrency_53?:                 string;
    transactionAmount_54?:                   string;
    tiporConvenienceIndicator_55?:           string;
    valueofConvenienceFeeFixed_56?:          string;
    valueofConvenienceFeePercentage_57?:     string;
    countryCode_58?:                         string;
    merchantName_59?:                        string;
    merchantCity_60?:                        string;
    postalCode_61?:                          string;
    additionalDataFieldTemplate_62?:         AdditionalDataFieldTemplate62;
    merchantInformationLanguageTemplate_64?: string;
    crC_63?:                                 string;
}

export interface AdditionalDataFieldTemplate62 {
    billNumber_01?:                    string;
    mobileNumber_02?:                  string;
    storeLabel_03?:                    string;
    loyaltyNumber_04?:                 string;
    referenceLabel_05?:                string;
    customerLabel_06?:                 string;
    terminalLabel_07?:                 string;
    purposeofTransaction_08?:          string;
    additionalConsumerDataRequest_09?: string;
    merchantTaxID_10?:                 string;
    merchantChannel_11?:               string;
}

export interface MerchantAccountInformation {
    visa_02?:       string;
    visa_03?:       string;
    mastercard_04?: string;
    mastercard_05?: string;
    emvCo_06?:      string;
    emvCo_07?:      string;
    emvCo_08?:      string;
    discover_09?:   string;
    discover_10?:   string;
    amex_11?:       string;
    amex_12?:       string;
    jcB_13?:        string;
    jcB_14?:        string;
    unionPay_15?:   string;
    unionPay_16?:   string;
    emvCo_17?:      string;
    emvCo_18?:      string;
    emvCo_19?:      string;
    emvCo_20?:      string;
    emvCo_21?:      string;
    emvCo_22?:      string;
    emvCo_23?:      string;
    emvCo_24?:      string;
    emvCo_25?:      string;
    npsB_26?:       NpsB2;
    npsB_27?:       NpsB2;
}

export interface NpsB2 {
    globallyUniqueIdentifier_00?: string;
    acquirerInstitutionType_01?:  string;
    acquirerID_02?:               string;
    merchantPAN_03?:              string;
    paymentNetworkSpecific_04?:   string;
    paymentNetworkSpecific_05?:   string;
}