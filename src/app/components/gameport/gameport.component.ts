import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/websocket.service';
import { User } from '../../classes/User';
import { BattleFieldComponent } from '../battlefield/battlefield.component';

@Component({
  selector: 'app-gameport',
  templateUrl: './gameport.component.html',
  styleUrls: ['./gameport.component.css']
})
export class GamePortComponent implements OnInit {
  @ViewChild(BattleFieldComponent) battlefield;
  users: User[]
  player: User

  constructor( 
    private userService: UserService,
    private WSService: WebSocketService,
    private router: Router ) { }

  ngOnInit() {
    
    let user = sessionStorage.getItem('MPGameUser')
    this.player = JSON.parse(user)
    this.setPlayerCon()

    ///
    // RESPONSES FROM WEBSOCKET
    ///
    console.log('Subscribing to sockets responses')
    this.WSService.onNotification().subscribe(msg => {
      console.log(`Notification: ${msg.message}`);
    });
    this.WSService.onNewMessage().subscribe(msg => {
      console.log(`Message received: ${msg.message}`);
    });
    this.WSService.onPlayerCon().subscribe(msg => {
      console.log(msg.message)
    });
    
  }

  generateRandomShips() {
    this.battlefield.generateRandomShips()
  }

  sendStartRequest() {
    this.battlefield.sendStartRequest()
  }

  sendBattleRequest() {
    let battlefield = this.battlefield
  }

  ///
  // REQUESTS TO WEBSOCKET SERVICE
  ///
  setPlayerCon() {
    console.log('Setting player in ws request made')
    this.WSService.setPlayerCon(this.player.username)
  }

  sendMessage() {
    this.WSService.sendMessage();
  }

  ///
  // REQUESTS TO USER SERVICE
  ///
  getUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.log("Error: " + error)
    )
  }
}
