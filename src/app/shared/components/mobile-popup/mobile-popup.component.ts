import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AdvertisementService } from 'src/app/services/advertisement.service';

@Component({
  selector: 'app-mobile-popup',
  template:'',
  // templateUrl: './mobile-popup.component.html',
  //styleUrls: ['./mobile-popup.component.css']
})
export class MobilePopupComponent implements OnInit {

  constructor(private matDialog:MatDialog, private advertisementService:AdvertisementService ,private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    setTimeout(()=>{this.checkMobileRegulation()},500);
  }

public getScreenWidth: any;
public getScreenHeight: any;
@Input() appDownloadUrl:string;
@Input() appIconUrl:string
@Input() set isOnClick(value:boolean){

  this.images.push(this.appIconUrl)
      if(value){
        this.matDialog.open(DialogData, {data: {icon:this.appIconUrl, url:this.appDownloadUrl,images:this.images,ismobileRegulation:false}})
      } 
}
@HostListener('window:resize', ['$event'])
onWindowResize() {
  // this.getScreenWidth = window.innerWidth;
  // this.getScreenHeight = window.innerHeight;
  // //this.checkMobileRegulation();
}
ismobileRegulation:boolean=false;
checkMobileRegulation() {
  var isAlredyLogin = localStorage.getItem('isAlredyLogin');
  if(isAlredyLogin=='true'){
    localStorage.setItem('isAlredyLogin', 'false');
    return;
  }
    localStorage.setItem('isAlredyLogin', 'false');
  if (this.getScreenWidth <= 768 || this.getScreenHeight < 100) {
    this.ismobileRegulation=true;
    this.showPopUp();
  }
  else{
    //Only Enable this line for advertise
    //setTimeout(()=>{this.getAdvertisementImageList()},500)
  }
}
showPopUp(){
 this.matDialog.open(DialogData, {data: {icon:this.appIconUrl, url:this.appDownloadUrl,ismobileRegulation:this.ismobileRegulation}})
}

images: any=[];
getAdvertisementImageList(){
  this.advertisementService.getAdvertisementList().subscribe(res=>{
    let images =res.Result;
    console.log(images) 
    images.forEach((img)=>{
    this.images.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' +img));
      console.log(this.images) 
    }) 
    this.matDialog.open(DialogData, {data: {icon:this.appIconUrl, url:this.appDownloadUrl,images:this.images,ismobileRegulation:this.ismobileRegulation}})
  });
  setTimeout(()=>{this.matDialog.closeAll()},5000)
}

}
@Component({
selector: 'dialog-data-example-dialog',
templateUrl: './mobile-popup.component.html',
styleUrls: ['./mobile-popup.component.css']
})
export class DialogData {
// constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

constructor(
  public dialogRef: MatDialogRef<DialogData>,
  @Inject(MAT_DIALOG_DATA) public data: any,
) {}

onNoClick(): void {
  this.dialogRef.close();
}
}

