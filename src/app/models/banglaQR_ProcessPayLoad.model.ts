export interface IProcessPayLoadResp {
    Status?:  string;
    Message?: string;
    Result?:  Result;
}

export interface Result {
    selectedOwnerPANHash?: null;
    selectedMarchentPAN?:  null;
    serialNumber?:         null;
    keyID?:                null;
    key1?:                 null;
    key2?:                 null;
    otp?:                  null;
    payLoadData?:          PayLoadData;
}

export interface PayLoadData {
    payloadFormatIndicator_00?:              string;
    pointOfInitiationMethod_01?:             string;
    merchantAccountInformation?:             MerchantAccountInformation;
    merchantCategoryCode_52?:                string;
    transactionCurrency_53?:                 string;
    transactionAmount_54?:                   null;
    tiporConvenienceIndicator_55?:           null;
    valueofConvenienceFeeFixed_56?:          null;
    valueofConvenienceFeePercentage_57?:     null;
    countryCode_58?:                         string;
    merchantName_59?:                        string;
    merchantCity_60?:                        string;
    postalCode_61?:                          null;
    additionalDataFieldTemplate_62?:         AdditionalDataFieldTemplate62;
    merchantInformationLanguageTemplate_64?: null;
    crC_63?:                                 string;
}

export interface AdditionalDataFieldTemplate62 {
    billNumber_01?:                    string;
    mobileNumber_02?:                  null;
    storeLabel_03?:                    string;
    loyaltyNumber_04?:                 null;
    referenceLabel_05?:                null;
    customerLabel_06?:                 null;
    terminalLabel_07?:                 string;
    purposeofTransaction_08?:          null;
    additionalConsumerDataRequest_09?: null;
    merchantTaxID_10?:                 null;
    merchantChannel_11?:               null;
}

export interface MerchantAccountInformation {
    visa_02?:       string;
    visa_03?:       null;
    mastercard_04?: string;
    mastercard_05?: null;
    emvCo_06?:      null;
    emvCo_07?:      null;
    emvCo_08?:      null;
    discover_09?:   null;
    discover_10?:   null;
    amex_11?:       null;
    amex_12?:       null;
    jcB_13?:        null;
    jcB_14?:        null;
    unionPay_15?:   string;
    unionPay_16?:   null;
    emvCo_17?:      null;
    emvCo_18?:      null;
    emvCo_19?:      null;
    emvCo_20?:      null;
    emvCo_21?:      null;
    emvCo_22?:      null;
    emvCo_23?:      null;
    emvCo_24?:      null;
    emvCo_25?:      null;
    npsB_26?:       NpsB26;
    npsB_27?:       NpsB27;
}

export interface NpsB26 {
    globallyUniqueIdentifier_00?: string;
    acquirerInstitutionType_01?:  string;
    acquirerID_02?:               string;
    merchantPAN_03?:              string;
    paymentNetworkSpecific_04?:   null;
    paymentNetworkSpecific_05?:   null;
}

export interface NpsB27 {
    globallyUniqueIdentifier_00?: string;
    acquirerInstitutionType_01?:  string;
    acquirerID_02?:               string;
    merchantPAN_03?:              string;
    paymentNetworkSpecific_04?:   null;
    paymentNetworkSpecific_05?:   null;
}