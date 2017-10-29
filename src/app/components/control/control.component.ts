import { 
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  @Input() model: any;
  @Input() bindTo: string;
  @Input() isEditable: boolean = true;
  @Input() caption: string;
  
  get value() {
    const value = this.model && this.model[this.bindTo];
    if (this.dataValueType === "date") {
      return this.isEditable ? this.getDateStringValue(value) : this.getDateValue(value);
    }
    return value;
  }

  set value(value: any) {
    if (this.model) {
      this.model[this.bindTo] = value;
    }
  }

  get dataValueType() : string {
    const value = this.model && this.model[this.bindTo];
    if (value && value.constructor === Date) {
      return "date";
    }

    if (value && value.constructor === Number) {
      return "number";
    }

    if (value && value.constructor === String) {
      return "text";
    }

    if (value && value.constructor === Boolean) {
      return "bolean";
    }

    return "text";
  }
  
  getDateValue(value: any) {
    if (value && value.constructor === Date) {
      return `${value.getDate()}.${value.getMonth() + 1}.${value.getFullYear()}`
    }
    return null;
  }

  getDateStringValue(value: any): string {
    if (value && value.constructor === Date) {
      return value.toISOString().substr(0, 10);
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
