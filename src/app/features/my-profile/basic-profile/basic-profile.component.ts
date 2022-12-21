import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IUserBasicProfile } from '../../../models/userbasicprofile.model';
import { UserProfileService } from '../../../services/userprofile.service';

@Component({
  selector: 'app-basic-profile',
  templateUrl: './basic-profile.component.html',
  styleUrls: ['./basic-profile.component.css'],
})
export class BasicProfileComponent implements OnInit {
  userProfileResult: IUserBasicProfile = {};

  // popup property
  popup: boolean = false;
  popupError: boolean = false;
  header: string = '';
  message: string = '';
  btnText: string = '';

  constructor(
    private userProfileService: UserProfileService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.userProfileService.getUserProfile().subscribe((Response) => {
      if (Response.Status == 'OK') {
        this.userProfileResult = Response.Result as IUserBasicProfile;
      } else if (Response.Status === 'UNAUTH') {
        this.authenticationService.logout();
      } else {
        // alert("Profile Loading Failed");
        this.popupError = true;
        this.header = 'Failure';
        this.message = 'Profile Loading Failed';
        this.btnText = 'Close';
        this.popup = true;
      }
    });
  }

  onCloseModal(close: boolean) {
    this.popup = close;
  }
}
