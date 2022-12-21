import { Component, OnInit } from '@angular/core';

import { IBankGuaranteeBeneficiaryType } from '../../../models/bankGuarantee_beneficiarytype.model';
import { IBankGuaranteeCategory } from '../../../models/bankGuarantee_category.model';
import { IBankGuaranteeCurrencyType } from '../../../models/bankGuarantee_currencytype.model';
import { IBankGuaranteeCountry } from '../../../models/bankGuarantee_country.model';
import { IBankGuaranteePeriod } from '../../../models/bankGuarantee_period.model';
import { IBankGuaranteeSecurityType } from '../../../models/bankGuarantee_securitytype.model';
import { IBankGuaranteeType } from '../../../models/bankGuarantee_type.model';
import { IBranchTransactionDate } from '../../../models/branchTransactionDate.model';

import { BankAccountService } from '../../../services/bankaccount.service';
import { BankGuaranteeService } from '../../../services/bankGuarantee.service';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-bankguarantee-request',
  templateUrl: './bankguarantee-request.component.html',
  styleUrls: ['./bankguarantee-request.component.css'],
})
export class BankguaranteeRequestComponent implements OnInit {
  bgBeneficiaryTypeList: IBankGuaranteeBeneficiaryType[];
  bgCategoryList: IBankGuaranteeCategory[];
  bgTypeList: IBankGuaranteeType[];
  bgCurrencyTypeList: IBankGuaranteeCurrencyType[];
  bgCountryList: IBankGuaranteeCountry[];
  bgPeriodList: IBankGuaranteePeriod[];
  bgSecurityTypeList: IBankGuaranteeSecurityType[];
  branchTransDate: IBranchTransactionDate = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    private bankAccountService: BankAccountService,
    private authenticationService: AuthenticationService,
    private bankGuaranteeService: BankGuaranteeService
  ) {}

  ngOnInit(): void {
    this.getBGCategory();
    this.getBGPeriod();
    this.getBGBeneficiaryType();
  }

  //Get Guarantee category
  getBGCategory() {
    this.bankGuaranteeService.getBGCategory().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.bgCategoryList = Response.Result as IBankGuaranteeCategory[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        alert(Response.Message);
      }
    });
  }

  //Get Guarantee Type
  getBGType(categoryId: string) {
    this.bankGuaranteeService.getBGType(categoryId).subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.bgTypeList = Response.Result as IBankGuaranteeType[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        alert(Response.Message);
      }
    });
  }

  //Get Guarantee Currency
  getBGCurrencyType(categoryId: string) {
    this.bankGuaranteeService
      .getBGCurrencyType(categoryId)
      .subscribe((Response) => {
        if (Response.Status == 'OK') {
          this.bgCurrencyTypeList.push(Response.Result);

          console.log(this.bgCurrencyTypeList);
          //this.bgCurrencyTypeList = Response.Result as IBankGuaranteeCurrencyType[];
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          alert(Response.Message);
        }
      });
  }

  //Get Guarantee Period
  getBGPeriod() {
    this.bankGuaranteeService.getBGPeriod().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.bgPeriodList = Response.Result as IBankGuaranteePeriod[];
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        alert(Response.Message);
      }
    });
  }

  //Get Guarantee Beneficiary Type
  getBGBeneficiaryType() {
    this.bankGuaranteeService.getBGBeneficiaryType().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.bgBeneficiaryTypeList =
          Response.Result as IBankGuaranteeBeneficiaryType[];
      } else {
        alert(Response.Message);
      }
    });
  }

  getInformationByCategory(event: any) {
    console.log(event.target.value);
    this.getBGType(event.target.value);
    this.getBGCurrencyType(event.target.value);
  }
}
