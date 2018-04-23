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
  chatMsgs: String[]
  onlineUsersNum: number

  constructor( 
    private userService: UserService,
    private WSService: WebSocketService,
    private router: Router ) { }

  ngOnInit() {
    
    let user = sessionStorage.getItem('MPGameUser')
    this.player = JSON.parse(user)
    this.setPlayerCon()
    this.chatMsgs = []
    this.onlineUsersNum = 0
    this.getOnlineUsers()

    ///
    // RESPONSES FROM WEBSOCKET
    ///
    console.log('Subscribing to sockets responses')
    this.WSService.onNotification().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(`Notification: ${msg.message}`);
      this.scrollChatBox()
    })
    this.WSService.onNewMessage().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(`Message received: ${msg.message}`);
      this.scrollChatBox()
    })
    this.WSService.onPlayerCon().subscribe(msg => {
      this.chatMsgs.push(this.createChatMsg(msg.message))
      console.log(msg.message)
      this.scrollChatBox()
    })
    this.WSService.onUsersOnline().subscribe(msg => {
      this.onlineUsersNum = +msg.message
      console.log(msg.message)
    })
    this.WSService.onBattleStarted().subscribe(msg => {
      console.log(msg.message)
      // Saving a battle name to LocalStorage
      localStorage.setItem('battleRoom', msg.message.battle._name)
      if (this.player.username === msg.message.battle._players[0].username) {
        this.battlefield.actionBattleFieledOwn = msg.message.battle._players[0]._battleField
        this.battlefield.actionBattleFieledEnemy = msg.message.battle._players[1]._battleField
      } else {
        this.battlefield.actionBattleFieledOwn = msg.message.battle._players[1]._battleField
        this.battlefield.actionBattleFieledEnemy = msg.message.battle._players[0]._battleField
      }
      this.battlefield.shipsAll = []
      if (this.player.username === msg.message.attacker) {

      } else {
        this.battlefield.battlefield = this.battlefield.actionBattleFieledOwn
      }
    })
    this.WSService.onGameState().subscribe(msg => {
      console.log(msg.message)
    })
  }

  scrollChatBox() {
    var chatBox = document.querySelector('.chat');
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  createChatMsg(msg) {
    let date = new Date()
    let h = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()
    let m = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
    return `${h}:${m} ${msg}`
  }

  generateRandomShips() {
    this.battlefield.generateRandomShips()
  }

  ///
  // REQUESTS TO WEBSOCKET SERVICE
  ///
  sendStartRequest() {
    let ships = this.battlefield.shipsAll
    let userX = {
      username: this.player.username,
      ships: ships
    }
    this.WSService.sendGameRequest(userX)
  }

  setPlayerCon() {
    console.log('Setting player in ws request made')
    this.WSService.setPlayerCon(this.player.username)
  }

  sendMessage() {
    this.WSService.sendMessage();
  }

  getOnlineUsers() {
    this.WSService.getUsersOnline();
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
