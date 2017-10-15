import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-viewmodel',
  templateUrl: './viewmodel.component.html',
  styleUrls: ['./viewmodel.component.css']
})
export class ViewmodelComponent implements OnInit {

  @Input() value: any;
  @Input() dataValueType: string;
  get dateValue() {
    const value = this.value;
    if (value && value.constructor === Date) {
      return `${value.getDate()}.${value.getMonth() + 1}.${value.getFullYear()}`
    }
    return value;
  }
  constructor() { }

  ngOnInit() {
  }

}
