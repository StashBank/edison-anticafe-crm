import { ContactCardDialogComponent } from './../components/contact-card-dialog/contact-card-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactServiceService } from '../services/contact-service.service';
import {
  MatTableDataSource,
  MatDialog
} from '@angular/material';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  searchFor: string;
  displayedColumns = [];
  dataSource = new MatTableDataSource<Contact>();
  columnsConfig: [{ caption: string, path: string }];
  selectedItem: Contact;

  constructor(
    private conactService: ContactServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.intiColumnsConfig();
    this.displayedColumns = this.columnsConfig.map(i => i.path);
    this.getContacts();
  }

  intiColumnsConfig() {
    this.columnsConfig = [
      { caption: 'Прізвище', path: 'firstName' },
      { caption: 'Ім\'я', path: 'lastName' },
      { caption: 'Продукт', path: 'product' },
      { caption: 'Вік', path: 'age' },
      { caption: 'Мобільний телефон', path: 'mobilePhone' },
      { caption: 'E-mail', path: 'email' },
      { caption: 'ЦА', path: 'target' },
      { caption: 'Дата народження', path: 'birthDate' },
      { caption: 'Примітки', path: 'notes' }
    ];
  }

  getContacts() {
    const contacts = this.conactService.getContacts();
    this.dataSource = new MatTableDataSource<Contact>(contacts);
  }

  search() {
    console.log(this.searchFor);
  }

  openContactDialog(contact?: Contact): Observable<any> {
    const dialogRef = this.dialog.open(ContactCardDialogComponent, {
      width: '640px',
      data: { contact: contact }
    });

    return dialogRef.afterClosed();
  }

  add() {
    this.openContactDialog()
      .subscribe(contact => {
        if (contact) {
          this.conactService.addContact(contact);
          this.getContacts();
        }
      });
  }

  edit() {
    if (this.selectedItem) {
      const contact = Object.assign({}, this.selectedItem);
      this.openContactDialog(contact)
        .subscribe(res => {
          if (res) {
            this.conactService.setContact(this.selectedItem.id, res);
            this.getContacts();
          }
          this.selectedItem = null;
        });
    }
  }

  delete() {
    if (this.selectedItem) {
      this.conactService.deleteContact(this.selectedItem.id);
      this.selectedItem = null;
      this.getContacts();
    }
  }

  onRowClick(row: any) {
    this.selectedItem = row;
  }

  getRowClass(row: Contact) {
    if (this.selectedItem && row && this.selectedItem.id === row.id) {
      return 'selected';
    }
  }

  getDisplayValue(value: any): string {
    if (!value) {
      return value;
    }
    if (value.constructor === Date) {
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      return `${day > 9 ? day : '0' + day}.${month > 9 ? month : '0' + month}.${year}`;
    }
    return value.toString();
  }
}
