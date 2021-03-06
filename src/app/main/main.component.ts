import { Router } from '@angular/router';
import { ContactCardDialogComponent } from '../components/contact-card-dialog/contact-card-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactServiceService } from '../services/contact-service.service';
import {
  MatTableDataSource,
  MatDialog,
  MatSort
} from '@angular/material';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  displayedColumns = [];
  dataSource = new MatTableDataSource<Contact>();
  columnsConfig: Array<{ caption: string, path: string }>;
  selectedItem: Contact;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private contactService: ContactServiceService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.initColumnsConfig();
    this.displayedColumns = this.columnsConfig.map(i => i.path);
    this.getContacts();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  initColumnsConfig() {
    this.columnsConfig = [
      //  caption: 'Ім\'я', path: 'firstName' },
      // { caption: 'Прізвище', path: 'lastName' },
      { caption: 'Номер клієнта', path: 'contactId' },
      { caption: 'Ім\'я', path: 'fullName' },
      { caption: 'Продукт', path: 'product' },
      { caption: 'Мобільний телефон', path: 'mobilePhone' },
      { caption: 'Вік', path: 'age' },
      // { caption: 'E-mail', path: 'email' },
      { caption: 'ЦА', path: 'target' },
      // { caption: 'Дата народження', path: 'birthDate' },
      { caption: 'Примітки', path: 'notes' }
    ];
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearFileter(filter) {
    filter.value = '';
    this.applyFilter('');
  }

  getContacts() {
    this.contactService.getContacts()
      .subscribe((res: {success: boolean, data: any[]}) => {
        if (res.success && res.data) {
          this.selectedItem = null;
          const contacts = res.data.map(i =>  new Contact(i));
          this.dataSource = new MatTableDataSource<Contact>(contacts);
          this.dataSource.sort = this.sort;
        }
      });
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
          this.contactService.addContact(contact)
          .subscribe((res: {success: boolean}) => {
            if (res.success) {
              this.getContacts();
            }
          });
        }
      });
  }

  edit() {
    if (this.selectedItem) {
      const contact = Object.assign({}, this.selectedItem);
      this.openContactDialog(contact)
        .subscribe(result => {
          if (result) {
            this.contactService.setContact(this.selectedItem.id, result)
            .subscribe((response: {success: boolean}) => {
              if (response.success) {
                this.getContacts();
              }
            });
          }
          this.selectedItem = null;
        });
    }
  }

  delete() {
    if (this.selectedItem) {
      const confirmation = confirm('Дійсно видалити?');
      if (confirmation === true) {
        this.contactService.deleteContact(this.selectedItem.id)
          .subscribe((res: { success: boolean }) => {
            if (res.success) {
              this.selectedItem = null;
              this.getContacts();
            }
          });
      }
    }
  }

  order() {
    const queryParams = this.selectedItem ? {contactId: this.selectedItem.id} : {};
    this.router.navigate(['order'], {queryParams});
  }

  onRowClick(row: any) {
    this.selectedItem = row;
  }

  onRowDblClick(row: any) {
    if (row.id) {
      this.router.navigate(['/contact', row.id]);
    }
  }

  getRowClass(row: Contact) {
    if (this.selectedItem && row && this.selectedItem === row) {
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
