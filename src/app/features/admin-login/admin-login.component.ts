import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  // form: FormGroup = new FormGroup({
  //   $key: new FormControl(null),
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   email: new FormControl(''),
  //   mobile: new FormControl(''),
  //   city: new FormControl(''),
  //   gender: new FormControl('1'),
  //   department: new FormControl(0),
  //   hireDate: new FormControl(''),
  //   isPermanent: new FormControl(false),
  // });


  form: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<AdminLoginComponent>) {
    this.form = new UntypedFormGroup({
      $key: new UntypedFormControl(null),
      fullName: new UntypedFormControl("", Validators.required),
      email: new UntypedFormControl("", Validators.email),
      mobile: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(8)
      ]),
      city: new UntypedFormControl(""),
      gender: new UntypedFormControl("1"),
      department: new UntypedFormControl(0),
      hireDate: new UntypedFormControl(""),
      isPermanent: new UntypedFormControl(false)
    });
  }
  
  
  

  // constructor(public dialogRef: MatDialogRef<AdminLoginComponent> ) { }

  ngOnInit(): void {
  }

  onReset(){
    this.form.reset();
  }

  onClose(){
    this.form.reset();
    this.dialogRef.close();
  }

}
