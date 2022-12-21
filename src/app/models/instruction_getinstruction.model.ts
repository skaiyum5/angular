export interface IGetInstructionResponse {
  accountNo?: string;
  beneficiaries?: InstructionBeneficiary[];
}

export interface InstructionBeneficiary {
  paye_acc_no?: string;
  branch_name?: string;
  inst_rule_name?: any;
  inst_sl_no?: string;
  benf_sl_no?: string;
  inst_typ?: string;
  benf_prio_no?: string;
  benf_cust_type?: string;
  benf_cust_grp_id?: string;
  benf_br_id?: string;
  benf_acc_no?: string;
  trm_freq?: string;
  trm_instl_amt?: string;
  trm_tot_amt?: string;
  st_pay_dt?: string;
  end_pay_dt?: string;
  lst_pay_dt?: string;
  next_pay_dt?: string;
  inst_status?: string;
  benf_acc_nm?: string;
  trm_tot_no?: string;
  trm_tot_on?: string;
}
