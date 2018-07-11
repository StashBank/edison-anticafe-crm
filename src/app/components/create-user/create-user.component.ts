import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
               private newUserService: UserService,
  ) { }

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      login: ['',
        [ Validators.required,
          Validators.pattern(/^([A-z][A-Za-z]*\s+[A-Za-z]*)|([A-z][A-Za-z]*)$/),]
      ],
      password: ['',
        [Validators.required,
        ]
      ],
      email: ['',
        [ Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]
      ],
      phone: ['',
        [Validators.required]]
    })
  }

  public registerNewUser() { //when add parametr 'userData' to function - compilator get error
    let sendData = this.createUserForm.value;

    this.newUserService.create(sendData).subscribe(send => {
      console.log('okay');
    }, error => {
      console.log('error');
    })
  }

}
