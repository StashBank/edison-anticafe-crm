import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NewUserService } from '../../services/new-user.service';


@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css']
})

export class CreateNewUserComponent implements OnInit {

  public createUserForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
               private newUserService: NewUserService,
  ) { }

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      newUserLogin: ['',
        [ Validators.required,
          Validators.pattern(/^([A-z][A-Za-z]*\s+[A-Za-z]*)|([A-z][A-Za-z]*)$/),]
      ],
      newUserPassword: ['',
        [Validators.required,
        ]
      ],
      newUserEmail: ['',
        [ Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]
      ],
      newUserPhoneNumber: ['',
        [Validators.required]]
    })
  }

  public registerNewUser() { //when add parametr 'userData' to function - compilator get error
    let sendData = this.createUserForm.value;

    this.newUserService.createNewUser(sendData).subscribe(send => {
      console.log('okay');
    }, error => {
      console.log('error');
    })
  }

}
