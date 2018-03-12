import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { WebSocketService } from './../../services/websocket.service';
import { IUser } from './../../interfaces/IUser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit{

  users: IUser[] = []
  state = 'inactive'

  private act = {
    user: 'user23',
    action: 'interacting'
  }

  user: IUser

  constructor( private userService: UserService, public WSService: WebSocketService ) { 

  }

  ngOnInit() {
    this.getUserById()
    this.WSService.onNewMessage().subscribe(msg => {
      console.log('got a msg: ' + msg.message);
    });
  }

  sendMessage() {
    let msg = 'msg from ' + this.user.username;
    this.WSService.sendMessage(msg);
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.log("Error: " + error)
    )
  }

  getUserById() {
    let userId = sessionStorage.getItem('userId');
    //console.log(userId)
    this.userService.getUserById(userId).subscribe(
      user => this.user = user,
      error => console.log("Error: " + error)
    )
  }
}
