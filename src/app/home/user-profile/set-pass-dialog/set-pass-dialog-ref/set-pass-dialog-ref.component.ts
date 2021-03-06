import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserBackendService } from '../../../../services/user-backend.service';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { noWhitespaceValidator } from '../../../../shared/validators/no-white-space-validator';

import { finalize } from 'rxjs/operators';
import { RESULT_ERROR, RESULT_SUCCEED, SET_PASS_ERROR, SET_PASS_SUCCEED } from '../../../../app.config';

@Component({
  selector: 'nx-set-pass-dialog-ref',
  templateUrl: './set-pass-dialog-ref.component.html',
  styleUrls: ['./set-pass-dialog-ref.component.css']
})
export class SetPassDialogRefComponent implements OnInit {

  setPassForm: FormGroup;
  user: User;
  hideCurrentPass = true;
  hideNewPass = true;

  isLoading = false;


  constructor(public dialogRef: MatDialogRef<SetPassDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private userBackendService: UserBackendService, private snackbarService: SnackbarService
  ) {

    this.user = data.user;
    console.log('***DialogSetPass*** user: ' + data.user.firstName  + ' type: ' + data.type);
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.setPassForm = this.formBuilder.group({
      currentPass: ['', [Validators.required, noWhitespaceValidator]],
      newPass1: ['', [Validators.required, noWhitespaceValidator]],
      newPass2: ['', [Validators.required, noWhitespaceValidator]],
    });

  }

  get currentPass() { return this.setPassForm.get('currentPass'); }
  get newPass1() { return this.setPassForm.get('newPass1'); }
  get newPass2() { return this.setPassForm.get('newPass2'); }

  comparePass() {
    if ((!this.newPass1.hasError('required') && !this.newPass2.hasError('required'))
      && (!this.newPass1.hasError('minlength') && !this.newPass2.hasError('minlength'))
    ) {

      if (this.newPass1.value !== this.newPass2.value) {
        console.log('no match');
        this.newPass1.setErrors({
          'noMatch': true
        });
        this.newPass2.setErrors({
          'noMatch': true
        });
      } else {
        console.log('match');
        this.newPass1.setErrors(null);
        this.newPass2.setErrors(null);
      }
    }
  }

  setPassword(): void {
    this.isLoading = true;

    let pass: string[] = [];
    pass.push(this.currentPass.value);
    pass.push(this.newPass1.value);

    this.userBackendService.setUserPasswordSecured(this.user.username, pass)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => {
        this.snackbarService.openSnackBar(SET_PASS_SUCCEED, RESULT_SUCCEED);
        this.dialogRef.close();
      }, err => {
        this.snackbarService.openSnackBar((err.error.errors) ? err.error.errors : SET_PASS_ERROR, RESULT_ERROR)
        this.dialogRef.close();
      });

  }

  cancel(): void {
    this.dialogRef.close();
  }
}