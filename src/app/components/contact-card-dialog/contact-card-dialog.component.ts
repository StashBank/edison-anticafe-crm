import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-card-dialog',
  templateUrl: './contact-card-dialog.component.html',
  styleUrls: ['./contact-card-dialog.component.css']
})
export class ContactCardDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ContactCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (!this.data.contact) {
      this.data.contact = new Contact();
    }
  }

}
