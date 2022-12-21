export interface IRequestPaperCertificate
{
    Branchid?: string,
    Accountnumber?: string,
    Certificatetype?: string,
    Purpose?: string,
    RefaranceNo?: string
}

export interface ICertificateDocType
{
    id?:   string;
    name?: string;
}