import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // New user instance, info binded from a view
  regUser: User = new User
  title: string = 'Welcome to MPGame';
  subtitle: string = 'Register and enjoy BATTLESHIP game.';

  constructor( private userService: UserService ) { }

  onSubmit() {
    console.log('Registration form submitted')
    console.log(JSON.stringify(this.regUser))
    this.userService.addUser(this.regUser)
  }

}
