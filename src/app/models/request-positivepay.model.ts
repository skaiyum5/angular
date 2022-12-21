export interface IRequestPositivePay
{
    BranchId?: string,
    AccountNo?: string,
    InstNo?: string,
    InstAmt?: string,
    StartDate?: string,
    ExpDate?: string,
    BrmProdId?: string,
    BeneficiaryName?: string,
    OTP?: string,
    TPIN?: string
}