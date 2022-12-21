export interface IUserProfileDetailResponse {
    basic?: Basic;
    address: Address[];
}

export interface Address {
    customerID?:            string;
    addressTypeId?:         string;
    addressType?:           string;
    address1?:              string;
    address2?:              string;
    city?:                  string;
    zipCode?:               string;
    countryId?:             string;
    stateLGID?:             string;
    districtLGID?:          string;
    thanaLGID?:             string;
    countryName?:           string;
    divisionName?:          string;
    districtName?:          string;
    thanaName?:             string;
    phone?:                 string;
    mobile?:                string;
    mobile2?:               string;
    mobile3?:               string;
    mobile4?:               string;
    mobile5?:               string;
    email?:                 string;
    fax?:                   string;
    telex?:                 string;
    swift?:                 string;
    web?:                   string;
    contact_person_nm?:     string;
    contact_person_desig?:  string;
    contact_person_phone?:  string;
    contact_person_mobile?: string;
    contact_person_email?:  string;
    upozila_citycorp_id?:   null;
    upozila_citycorp_nm?:   null;
    union_muni_id?:         null;
    union_muni_nm?:         null;
    vill_ward_id?:          null;
    vill_ward_nm?:          null;
    ps_id?:                 null;
    ps_nm?:                 null;
    is_citycorp?:           null;
}

export interface Basic {
    customeR_ID?: string;
    customeR_FULL_NM?: string;
    fatheR_NM?: string;
    motheR_NM?: string;
    customeR_TYPE_ID?: string;
    customeR_TYPE_NM?: string;
    birtH_DATE?: string;
    homE_BRANCH_ID?: string;
    brancH_NM?: null;
    nationaL_ID?: string;
    tiN_NO?: string;
    smarT_CARD_NO?: string;
    birtH_REG_NO?: string;
    birtH_REG_ISSUE_DT?: string;
    blooD_GROUP?: string;
    passporT_NO?: string;
}

