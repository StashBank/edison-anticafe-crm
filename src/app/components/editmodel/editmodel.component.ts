import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-editmodel',
  templateUrl: './editmodel.component.html',
  styleUrls: ['./editmodel.component.css']
})
export class EditmodelComponent implements OnInit {
  @Input() value: any;
  @Input() dataValueType: string;
  get dateValue() {
    const value = this.value;
    if (value && value.constructor === Date) {
      return `${value.getDate()}.${value.getMonth() + 1}.${value.getFullYear()}`
    }
    return value;
  }

  get dateStringValue(): string {
    const value = this.value;
    if (value && value.constructor === Date) {
      return value.toISOString().substr(0, 10);
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
