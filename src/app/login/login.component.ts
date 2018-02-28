import { Component, OnInit } from '@angular/core';
import { UserService } from './../user.service';
import { User } from './../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser: User = {
    id: '',
    email: '',
    username: '',
    password: ''
  }

  constructor( private userService: UserService ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('login form submitted')
    this.userService.loginUser(this.loginUser)
  }

}
