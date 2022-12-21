import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Basic,
  Address,
  IUserProfileDetailResponse,
} from '../../../models/userdetailsprofile.model';

import { ICustomerProfilePhoto } from '../../../models/customerdoc.model';
import { CustomerDocService } from '../../../services/customerdoc.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UseractivityService } from 'src/app/services/useractivity.service';
import { ActivityType } from 'src/app/models/app_enum.model';

@Component({
  selector: 'app-detail-profile',
  templateUrl: './detail-profile.component.html',
  styleUrls: ['./detail-profile.component.css'],
})
export class DetailProfileComponent implements OnInit {
  @ViewChild('file') file: ElementRef;

  userProfile: Basic = {};
  userAddress: Address[] = [];
  contactInfo: any;
  customerProfilePhoto: ICustomerProfilePhoto = {};
  activityType = ActivityType;

  imagePath: any;
  isShowChangePhotoLink: boolean = true;
  isShowImageUploader: boolean = false;
  uploadedDocs: { doc_name: string; doc: File }[] = [];

  submitted = false;
  loader = false;

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private route: ActivatedRoute,
    private customerDocService: CustomerDocService,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private userActivityService: UseractivityService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.contactInfo = data.contactInfo.Result;      
      this.userProfile = this.contactInfo.basic;
      this.userAddress = this.contactInfo.address;
    });

    this.getCustomerProfilePhoto();

    // Activity Log
    // this.userActivityService.addNewActivity('entered profile page.', 'User viewed profile', this.activityType.LOGIN).subscribe(response => {});
  }

  getCustomerProfilePhoto() {
    this.customerDocService.getCustomerProfilePhoto().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.customerProfilePhoto = Response as ICustomerProfilePhoto;

        this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.customerProfilePhoto.Result);
        
        if (this.imagePath == '' || this.imagePath == null) {
          this.imagePath = `assets/images/User.jpg`;
        }
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        this.imagePath = `assets/images/User.jpg`;
      }
    });
  }

  changeProfileImage() {
    this.isShowChangePhotoLink = false;
    this.isShowImageUploader = true;
  }

  onFileChange(event: any) {
    if (event.target.files?.length > 0) {
      const file: File = event.target.files[0];
      let doc = {        
        doc_name: file.name,
        doc: file,
      };     
      this.uploadedDocs.push(doc);      
    }
  }

  saveCustomerProfilePhoto() {
    this.loader = true;
    this.uploadedDocs.map((document) => {
      let formData = new FormData();
      formData.append('document', document.doc, document.doc.name);     
      return this.customerDocService
        .saveCustomerProfilePhoto(formData)
        .subscribe((response) => {          
          if (response.Status == 'OK') {       
            this.popupError = false;
            this.header = 'Success';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;

            this.getCustomerProfilePhoto();
            this.isShowChangePhotoLink = true;
            this.isShowImageUploader = false;
          }
          else if (response.Status === 'UNAUTH') {
            this.authenticationService.logout();
          } else {
            this.popupError = true;
            this.header = 'Failure';
            this.message = response.Message;
            this.btnText = 'Close';
            this.popup = true;
          }
        });
    });
    this.popupError = true;
    this.header = 'Failure';
    this.message = 'Please Select a Picture';
    this.btnText = 'Close';
    this.popup = true;
    this.loader = false;
    this.uploadedDocs = [];
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
