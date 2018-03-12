import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { User } from './../../User';

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
  
  title: string = 'Welcome to MPGame';
  subtitle: string = 'Your time killer.';

  constructor( private userService: UserService ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('login form submitted')
    this.userService.loginUser(this.loginUser)
  }
}
