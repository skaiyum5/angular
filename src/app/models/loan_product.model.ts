export interface ILoanProduct {
  product_id: string;
  product_nm: string;
  service_type_id: string;
  lon_finance_sector_id: string;
  term_period_id: string;
  term_period_min: number;
  term_period_max: number;
  limit_minimum: number;
  limit_maximum: number;
}
