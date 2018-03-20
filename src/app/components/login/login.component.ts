import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser: User = new User()
  
  title: string = 'Welcome to MPGame';
  subtitle: string = 'BATTLESHIP';

  constructor( private userService: UserService ) { }

  ngOnInit() { }

  onSubmit() {
    // console.log('Login form submitted')
    this.userService.loginUser(this.loginUser)
  }
}
