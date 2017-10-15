import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';

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
  constructor() { }

  ngOnInit() {
    this.contactCollection = {
      rowConfig: [
        { caption: "Прізвище", path: "firstName"},
        { caption: "Ім'я", path: "lastName" },
        { caption: "Мобільний телефон", path: "mobilePhone" },
        { caption: "E-mail", path: "email" },
        { caption: "Дата народження", path: "birthDate", dataValueType: "date" }
      ],
      items: [{
        model: {
          firstName: "1-Тестовий",
          lastName: "1-Клієнт",
          mobilePhone: "0123456789",
          email: "some-mail-1@email.com",
          birthDate: new Date(1989, 5, 26)
        },
        selected: false
      }, {
        model: {
          firstName: "2-Тестовий",
          lastName: "2-Клієнт",
          mobilePhone: "0123456788",
          email: "some-mail-2@email.com",
          birthDate: new Date(1989, 5, 27)
        }, 
        selected: false
      }, {
        model: {
          firstName: "3-Тестовий",
          lastName: "3-Клієнт",
          mobilePhone: "0123456787",
          email: "some-mail-3@email.com",
          birthDate: new Date(1989, 5, 28)
        },
        selected: false
      }]
   }
  }

  add(){
    let item = {
      model: {
        firstName: "",
        lastName: "",
        mobilePhone: null,
        email: null,
        birthDate: null
      },
      selected: false
    };
    this.contactCollection.items.push(item);
    this.onItemClick(item, this.contactCollection.items.length - 1);
  }

  onItemClick(selectedItem: any, selectedIndex: number) {
    this.selectedItem = selectedItem;
    this.selectedIndex = selectedIndex;
    this.contactCollection.items.forEach((item, index, arr)=> {
      item.selected = index === selectedIndex;
    });
  }

  discardChanges(selectedItem: any, selectedIndex: number) {
    this.selectedItem = null;
    this.selectedIndex = -1;
    selectedItem.selected = false;
  }

  deleteItem(selectedItem: any, selectedIndex: number) {
    this.selectedItem = null;
    this.selectedIndex = -1;
    selectedItem.selected = false;
    this.contactCollection.items.splice(selectedIndex, 1);
  }
  
}
