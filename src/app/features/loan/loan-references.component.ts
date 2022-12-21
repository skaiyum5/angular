import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ILoanReference } from 'src/app/models/loan_references.model';

@Component({
  selector: 'app-loan-references',
  templateUrl: './loan-references.component.html',
  styleUrls: ['./loan-references.component.css'],
})
export class LoanReferencesComponent implements OnInit {
  referenceForm: UntypedFormGroup;
  loanReference: ILoanReference;
  @Input() loanReferenceList: ILoanReference[] = [];
  @Input() success: boolean;
  @Output() referencesEmitter = new EventEmitter<ILoanReference[]>();
  @Output() showReferenceEmitter = new EventEmitter<boolean>();

  // ux
  btnVisible = true;

  dataSource = new MatTableDataSource<ILoanReference>([]);

  displayedColumns: string[] = [
    'name',
    'relation',
    'profession',
    'eduQualification',
    'email',
    'mobile',
    'action',
  ];

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.dataSource.data = this.loanReferenceList;

    this.referenceForm = this.formBuilder.group({
      name: ['', Validators.required],
      relation: ['', Validators.required],
      profession: ['', Validators.required],
      eduQualification: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  ngOnChanges() {
    if(this.success) {
      this.referenceForm.reset()
      this.loanReference = null
      this.loanReferenceList = []
      this.btnVisible = true;
    }
  }

  get f() {
    return this.referenceForm.controls;
  }

  onSubmit() {
    this.loanReference = {
      ReferenceName: this.f.name.value,
      ReferenceRelation: this.f.relation.value,
      ReferenceProfession: this.f.profession.value,
      ReferenceEduQualification: this.f.eduQualification.value,
      ReferenceEmail: this.f.email.value,
      ReferenceMobile: this.f.mobile.value,
    };
    this.loanReferenceList.push(this.loanReference);
    this.dataSource.data = this.loanReferenceList;
    this.referenceForm.reset()
  }

  onDelete(element: any) {
    this.loanReferenceList = this.loanReferenceList.filter(
      (loanReference) => loanReference !== element
    );
    this.dataSource.data = this.loanReferenceList;
  }

  onNext() {
    this.referencesEmitter.emit(this.loanReferenceList);
    // this.btnVisible = false;
  }

  onBack() {
    this.showReferenceEmitter.emit(false);
  }
}
