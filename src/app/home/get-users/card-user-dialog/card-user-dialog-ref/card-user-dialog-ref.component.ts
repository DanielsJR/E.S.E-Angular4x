import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';

@Component({
  selector: 'nx-card-user-dialog-ref',
  templateUrl: './card-user-dialog-ref.component.html',
  styleUrls: ['./card-user-dialog-ref.component.css']
})
export class CardUserDialogRefComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<CardUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.user = data.user;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
  detail(): void {
    this.dialogRef.close('detail');
  }

  edit(): void {
    this.dialogRef.close('edit');
  }

  delete(): void {
    this.dialogRef.close('delete');
  }


}

