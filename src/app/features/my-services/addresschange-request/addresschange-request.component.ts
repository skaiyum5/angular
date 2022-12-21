import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { IRequestChangeAddress } from '../../../models/request-changeaddress.model';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { IUserFullAddress } from '../../../models/user_address.model';
import { IDivisionList, IDistrictList, IThanaList, IUnionMunicipalityList, IUpozilaCitycorporationList, IVillageWardList } from '../../../models/location.model';
import { ContactdetailsService } from '../../../services/contactdetails.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-addresschange-request',
  templateUrl: './addresschange-request.component.html',
  styleUrls: ['./addresschange-request.component.css'],
})
export class AddresschangeRequestComponent implements OnInit {
  addressDataSource = new MatTableDataSource<IUserFullAddress>([]);
  changeAddress: IRequestChangeAddress = {};
  selectedAddress: IUserFullAddress = {};

  divisionList: IDivisionList[];
  districtList: IDistrictList[];
  thanaList: IThanaList[];
  unionList: IUnionMunicipalityList[];
  upozilaList: IUpozilaCitycorporationList[];
  villageList: IVillageWardList[];

  changeAddressForm: UntypedFormGroup;

  submitted = false;
  loading = false;

  displayedColumns: string[] = ['addressType', 'address1', 'address2', 'divisionName', 'districtName', 'thanaName', 'phone', 'mobile', 'email', 'edit'];

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  addressType: string = '';
  isAddressListShow: boolean = true
  isAddressEditUIShow: boolean = false;
  isContactPersonUIShow: boolean = false;
  
  countryName: string = '';
  divisionName: string = '';
  districtName: string = '';
  thanaName: string = '';
  upozilaName: string = '';
  unionName: string = '';
  villageName: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private requestService: RequestService,
    private contactDetailService: ContactdetailsService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getFullAddressDetail();
    this.getDivisionList();
    
    this.changeAddressForm = new UntypedFormGroup({
      txtAddress1: new UntypedFormControl('', Validators.required),
      txtAddress2: new UntypedFormControl(''),
      txtCity: new UntypedFormControl(''),
      txtZipcode: new UntypedFormControl(''),
      ddlDistrict: new UntypedFormControl(''),
      txtSearchDistrict: new UntypedFormControl(''),
      ddlDivision: new UntypedFormControl(''),
      txtSearchDivision: new UntypedFormControl(''),
      ddlThana: new UntypedFormControl(''),
      txtSearchThana: new UntypedFormControl(''),
      ddlUpozila: new UntypedFormControl(''),
      txtSearchUpozila: new UntypedFormControl(''),
      ddlUnion: new UntypedFormControl(''),
      txtSearchUnion: new UntypedFormControl(''),
      ddlVillage: new UntypedFormControl(''),
      txtSearchVillage: new UntypedFormControl(''),
      txtCountry: new UntypedFormControl(''),
      txtState: new UntypedFormControl(''),
      txtPhone: new UntypedFormControl(''),
      txtMobile: new UntypedFormControl('',
        [Validators.required, Validators.pattern('[0-9]+')],
      ),
      txtMobile2: new UntypedFormControl(''),
      txtEmail: new UntypedFormControl(''),
      chkIsCityCorporation: new UntypedFormControl(false),
      // txtFax: new FormControl(''),
      // txtTelex: new FormControl(''),
      txtContactPersonName: new UntypedFormControl(''),
      txtContactPersonDesignation: new UntypedFormControl(''),
      txtContactPersonPhone: new UntypedFormControl(''),
      txtContactPersonMobile: new UntypedFormControl(''),
      txtContactPersonEmail: new UntypedFormControl(''),
    });
  }

  get f() {
    return this.changeAddressForm.controls;
  }

  getFullAddressDetail() {
    this.isAddressListShow = true;
    this.isAddressEditUIShow = false;

    this.contactDetailService
      .getUserFullAddress()
      .subscribe((Response) => {
        console.log(Response);
        if (Response.Status == 'OK') {
          this.addressDataSource.data = Response.Result as any;
          this.loading = false;
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = 'User Address Loading Failed';
          this.btnText = 'Reload';
          this.popup = true;
        }
      });
  }

  getDivisionList() {
    this.contactDetailService.getDivisionList().subscribe((Response) => {      
      if (Response.Status == 'OK') {        
        this.divisionList = Response.Result as IDivisionList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Division Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getDistrictList(event: any) {
    this.divisionName = event.source.selected.viewValue + '(' + event.value + ')';

    this.contactDetailService.getDistrictList(event.value).subscribe((Response) => {      
      if (Response.Status == 'OK') {
        this.districtList = Response.Result as IDistrictList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'District Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getThanaList(districtId: string) {
    this.contactDetailService.getThanaList(districtId).subscribe((Response) => {     
      if (Response.Status == 'OK') {
        this.thanaList = Response.Result as IThanaList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Police Station Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getUpozilaCitycorporationList(districtId: string) {
    this.contactDetailService.getUpozilaCitycorporationList(districtId).subscribe((Response) => {     
      if (Response.Status == 'OK') {
        console.log(Response);
        this.upozilaList = Response.Result as IUpozilaCitycorporationList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Upozila or City Corporation Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getUnionMunicipalityList(event: any) {
    this.upozilaName = event.source.selected.viewValue + '(' + event.value + ')';
    console.log(this.upozilaName);

    this.contactDetailService.getUnionMunicipalityList(event.value).subscribe((Response) => {     
      if (Response.Status == 'OK') {
        this.unionList = Response.Result as IUnionMunicipalityList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Union or Municipality Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  getVillageWardList(event: any) {
    this.unionName = event.source.selected.viewValue + '(' + event.value + ')';
    console.log(this.unionName);
    this.contactDetailService.getVillageWardList(event.value).subscribe((Response) => {     
      if (Response.Status == 'OK') {
        this.villageList = Response.Result as IVillageWardList[];
      } else {
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Village or Ward Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  onChangeDistrict(event: any) {
    this.districtName = event.source.selected.viewValue + '(' + event.value + ')';

    console.log(this.districtName);
    this.getThanaList(event.value);
    this.getUpozilaCitycorporationList(event.value);
  }

  onChangeThana(event: any) {
    this.thanaName = event.source.selected.viewValue + '(' + event.value + ')';
    console.log(this.thanaName);    
  }

  onChangeVillage(event: any) {
    this.villageName = event.source.selected.viewValue + '(' + event.value + ')';
    console.log(this.villageName);    
  }

  updateAddress(rowData: IUserFullAddress) {
    console.log(rowData);
    this.selectedAddress = rowData;

    this.addressType = this.selectedAddress.addressTypeId;
    this.changeAddressForm.patchValue({txtAddress1: this.selectedAddress.address1});
    this.changeAddressForm.patchValue({txtAddress2: this.selectedAddress.address2});
    this.changeAddressForm.patchValue({txtCity: this.selectedAddress.city});
    this.changeAddressForm.patchValue({txtZipcode: this.selectedAddress.zipCode});
    this.countryName = this.selectedAddress.countryName + '(' + this.selectedAddress.countryId + ')';
    this.changeAddressForm.patchValue({ddlDivision: this.selectedAddress.stateLGID == null ? '' : this.selectedAddress.stateLGID});
    this.changeAddressForm.patchValue({ddlDistrict: this.selectedAddress.districtLGID == null ? '' : this.selectedAddress.districtLGID});
    this.changeAddressForm.patchValue({ddlThana: this.selectedAddress.thanaLGID == null ? '' : this.selectedAddress.thanaLGID});
    this.changeAddressForm.patchValue({ddlUpozila: this.selectedAddress.upozila_citycorp_id == null ? '' : this.selectedAddress.upozila_citycorp_id});
    this.changeAddressForm.patchValue({ddlUnion: this.selectedAddress.union_muni_id == null ? '' : this.selectedAddress.union_muni_id});
    this.changeAddressForm.patchValue({ddlVillage: this.selectedAddress.vill_ward_id == null ? '' : this.selectedAddress.vill_ward_id});
    this.changeAddressForm.patchValue({txtPhone: this.selectedAddress.phone});
    this.changeAddressForm.patchValue({txtMobile: this.selectedAddress.mobile});
    this.changeAddressForm.patchValue({txtMobile2: this.selectedAddress.mobile2});
    this.changeAddressForm.patchValue({txtEmail: this.selectedAddress.email});
    this.changeAddressForm.patchValue({chkIsCityCorporation: this.selectedAddress.is_citycorp});
    
    // this.changeAddressForm.patchValue({txtFax: this.selectedAddress.fax});
    // this.changeAddressForm.patchValue({txtTelex: this.selectedAddress.telex});
    this.changeAddressForm.patchValue({txtContactPersonName: this.selectedAddress.contact_person_nm});
    this.changeAddressForm.patchValue({txtContactPersonDesignation: this.selectedAddress.contact_person_desig});
    this.changeAddressForm.patchValue({txtContactPersonPhone: this.selectedAddress.contact_person_phone});
    this.changeAddressForm.patchValue({txtContactPersonMobile: this.selectedAddress.contact_person_mobile});
    this.changeAddressForm.patchValue({txtContactPersonEmail: this.selectedAddress.contact_person_email});

    this.isAddressListShow = false;
    this.isAddressEditUIShow = true;
  }

  createAddressChangeRequest() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.changeAddressForm.invalid) {
      return;
    }
    
    this.changeAddress.AddressType = this.addressType;
    this.changeAddress.Address1 = this.f.txtAddress1.value;
    this.changeAddress.Address2 = this.f.txtAddress2.value;
    this.changeAddress.City = this.f.txtCity.value;
    this.changeAddress.ZipCode = this.f.txtZipcode.value;
    this.changeAddress.Country = this.countryName;
    this.changeAddress.State = this.divisionName;
    this.changeAddress.Division = this.divisionName;
    this.changeAddress.District = this.districtName
    this.changeAddress.Thana = this.thanaName;
    this.changeAddress.Phone = this.f.txtPhone.value;
    this.changeAddress.Mobile = this.f.txtMobile.value;
    this.changeAddress.Mobile2 = this.f.txtMobile2.value;
    this.changeAddress.Mobile3 = '';
    this.changeAddress.Mobile4 = '';
    this.changeAddress.Mobile5 = '';
    this.changeAddress.Email = this.f.txtEmail.value;    
    // this.changeAddress.Fax = this.f.txtFax.value;
    // this.changeAddress.Telex = this.f.txtTelex.value;
    this.changeAddress.Swift = '';
    this.changeAddress.Web = '';
    this.changeAddress.ContactPersonNm = this.f.txtContactPersonName.value;
    this.changeAddress.ContactPersonDesig = this.f.txtContactPersonDesignation.value;
    this.changeAddress.ContactPersonPhone = this.f.txtContactPersonPhone.value;
    this.changeAddress.ContactPersonMobile = this.f.txtContactPersonMobile.value;
    this.changeAddress.ContactPersonEmail = this.f.txtContactPersonEmail.value;
    this.changeAddress.UpozilaCitycorp = this.upozilaName;
    this.changeAddress.UnionMuni = this.unionName;
    this.changeAddress.VillWard = this.villageName;
    this.changeAddress.IsCitycorp = this.f.chkIsCityCorporation.value;

    console.log(this.changeAddress);

    this.requestService
      .sendChangeAddressRequest(this.changeAddress)
      .subscribe((Response) => {
        console.log(this.changeAddress);
        console.log(Response);
        if (Response.Status == 'OK') {
          this.popupError = false;
          this.header = 'Success';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
          this.getFullAddressDetail();
        } else if (Response.Status === 'UNAUTH') {
          this.authenticationService.logout();
        } else {
          this.popupError = true;
          this.header = 'Failure';
          this.message = Response.Message;
          this.btnText = 'Close';
          this.popup = true;
        }
        this.loading = false;
      });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }

  goBackToList() {
    this.changeAddressForm.reset();

    this.isAddressEditUIShow = false;
    this.isAddressListShow = true;    
  }
}
