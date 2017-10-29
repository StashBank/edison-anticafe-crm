import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactServiceService } from '../services/contact-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  selectedItem: any;
  selectedIndex: number = -1;
  contactCollection: {
    rowConfig: any[], 
    items: [{
      model: Contact,
      selected: boolean
    }],
  };
  constructor(private conactService: ContactServiceService) { }

  ngOnInit() {
    this.contactCollection = {
      rowConfig: [
        { caption: "Прізвище", path: "firstName" },
        { caption: "Ім'я", path: "lastName" },
        { caption: "Мобільний телефон", path: "mobilePhone" },
        { caption: "E-mail", path: "email" },
        { caption: "Дата народження", path: "birthDate", dataValueType: "date" }
      ],
      items: <[{ model: Contact, selected: boolean }]>[]
    }
    this.getContacts();
  }

  getContacts() {
    this.contactCollection.items.length = 0;
    const contacts = this.conactService.getContacts();
    if (contacts) {
      contacts.forEach((item) => this.contactCollection.items.push({
        model: item,
        selected: false
      }));
    }
  }

  add(){
    const contact = {
      firstName: "",
      lastName: "",
      mobilePhone: null,
      email: null,
      birthDate: null
    };
    const item = {
      model: contact,
      selected: false
    };
    //this.contactCollection.items.push(item);
    this.conactService.addContact(contact);
    this.getContacts();
    this.onItemClick(item, this.contactCollection.items.length - 1);
  }

  saveRowData(id: number) {
    const contact = this.selectedItem.model;
    this.conactService.setContact(id, contact);
    this.getContacts();
  }

  onItemClick(selectedItem: any, selectedIndex: number) {
    if (this.selectedIndex > -1) {
      this.discardChanges(this.selectedItem, this.selectedIndex);
    }
    this.selectedItem = {model: selectedItem.model};
    this.selectedIndex = selectedIndex;
    this.contactCollection.items.forEach((item, index, arr)=> {
      item.selected = index === selectedIndex;
    });
  }

  discardChanges(selectedItem: any, selectedIndex: number) {
    this.selectedItem = null;
    this.selectedIndex = -1;
    selectedItem.selected = false;
    this.contactCollection.items[selectedIndex].model = 
      this.conactService.getContact(selectedIndex);
  }

  deleteItem(selectedItem: any, selectedIndex: number) {
    this.selectedItem = null;
    this.selectedIndex = -1;
    selectedItem.selected = false;
    //this.contactCollection.items.splice(selectedIndex, 1);
    this.conactService.deleteContact(selectedIndex);
    this.getContacts();
  }
  
}
